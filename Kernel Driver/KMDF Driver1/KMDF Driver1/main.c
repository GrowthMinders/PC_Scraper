#include <ntddk.h>
#include <ntstrsafe.h>

#define IOCTL_GET_CPU_JSON CTL_CODE(FILE_DEVICE_UNKNOWN, 0x800, METHOD_BUFFERED, FILE_ANY_ACCESS)

//
// Missing definitions (WDK-safe)
//
#ifndef SystemProcessorPerformanceInformation
#define SystemProcessorPerformanceInformation 8
#endif

typedef struct _SYSTEM_PROCESSOR_PERFORMANCE_INFORMATION {
    LARGE_INTEGER IdleTime;
    LARGE_INTEGER KernelTime;
    LARGE_INTEGER UserTime;
    LARGE_INTEGER DpcTime;
    LARGE_INTEGER InterruptTime;
    ULONG InterruptCount;
} SYSTEM_PROCESSOR_PERFORMANCE_INFORMATION,
* PSYSTEM_PROCESSOR_PERFORMANCE_INFORMATION;

NTSYSAPI NTSTATUS NTAPI ZwQuerySystemInformation(
    ULONG SystemInformationClass,
    PVOID SystemInformation,
    ULONG SystemInformationLength,
    PULONG ReturnLength
);

//
// Globals
//
static KTIMER Timer;
static KDPC TimerDpc;
static LARGE_INTEGER Timeout;

static LARGE_INTEGER PreIdleTime = { 0 };
static LARGE_INTEGER PreTotalTime = { 0 };

static PDEVICE_OBJECT g_DeviceObject = NULL;

static char g_LastJson[512] =
"{\"cpu_load\":0,\"precision_load\":\"0.00\",\"uptime\":\"00:00:00:00\"}";

//
// Worker
//
static VOID ProcessMonitorWorker(PDEVICE_OBJECT DeviceObject, PVOID Context)
{
    UNREFERENCED_PARAMETER(DeviceObject);

    PIO_WORKITEM workItem = (PIO_WORKITEM)Context;

    ULONG cpuCount = KeQueryActiveProcessorCount(NULL);
    if (cpuCount == 0) cpuCount = 1;

    ULONG perfSize =
        sizeof(SYSTEM_PROCESSOR_PERFORMANCE_INFORMATION) * cpuCount;

    PSYSTEM_PROCESSOR_PERFORMANCE_INFORMATION info =
        (PSYSTEM_PROCESSOR_PERFORMANCE_INFORMATION)
        ExAllocatePoolWithTag(NonPagedPool, perfSize, 'prfT');

    if (!info) {
        IoFreeWorkItem(workItem);
        KeSetTimer(&Timer, Timeout, &TimerDpc);
        return;
    }

    ULONG returnLength = 0;

    NTSTATUS status = ZwQuerySystemInformation(
        SystemProcessorPerformanceInformation,
        info,
        perfSize,
        &returnLength
    );

    if (NT_SUCCESS(status) &&
        returnLength >= sizeof(SYSTEM_PROCESSOR_PERFORMANCE_INFORMATION))
    {
        ULONG validCount =
            returnLength / sizeof(SYSTEM_PROCESSOR_PERFORMANCE_INFORMATION);

        if (validCount > cpuCount)
            validCount = cpuCount;

        LONGLONG totalIdle = 0;
        LONGLONG totalKernel = 0;
        LONGLONG totalUser = 0;

        for (ULONG i = 0; i < validCount; i++) {
            totalIdle += info[i].IdleTime.QuadPart;
            totalKernel += info[i].KernelTime.QuadPart;
            totalUser += info[i].UserTime.QuadPart;
        }

        LONGLONG currentTotal = totalKernel + totalUser;
        LONGLONG currentIdle = totalIdle;

        if (PreTotalTime.QuadPart != 0)
        {
            LONGLONG deltaTotal = currentTotal - PreTotalTime.QuadPart;
            LONGLONG deltaIdle = currentIdle - PreIdleTime.QuadPart;

            if (deltaTotal > 0)
            {
                LONGLONG deltaBusy = deltaTotal - deltaIdle;

                ULONG rawCpuLoad =
                    (ULONG)((100 * deltaBusy) / deltaTotal);

                LONGLONG loadFixedPoint =
                    (10000 * deltaBusy) / deltaTotal;

                LARGE_INTEGER tickCount;
                KeQueryTickCount(&tickCount);

                ULONG64 totalSec =
                    (tickCount.QuadPart *
                        (ULONG64)KeQueryTimeIncrement()) / 10000000ULL;

                RtlStringCchPrintfA(
                    g_LastJson,
                    sizeof(g_LastJson),
                    "{\"cpu_load\":%u,"
                    "\"precision_load\":\"%u.%02u\","
                    "\"uptime\":\"%llu:%02llu:%02llu:%02llu\"}",
                    rawCpuLoad,
                    (ULONG)(loadFixedPoint / 100),
                    (ULONG)(loadFixedPoint % 100),
                    totalSec / 86400,
                    (totalSec % 86400) / 3600,
                    (totalSec % 3600) / 60,
                    totalSec % 60
                );
            }
        }

        PreTotalTime.QuadPart = currentTotal;
        PreIdleTime.QuadPart = currentIdle;
    }

    ExFreePool(info);
    IoFreeWorkItem(workItem);

    KeSetTimer(&Timer, Timeout, &TimerDpc);
}

//
// Dispatch
//
NTSTATUS GlobalDispatch(PDEVICE_OBJECT DeviceObject, PIRP Irp)
{
    UNREFERENCED_PARAMETER(DeviceObject);

    PIO_STACK_LOCATION irpSp = IoGetCurrentIrpStackLocation(Irp);

    NTSTATUS status = STATUS_SUCCESS;
    ULONG_PTR returnLength = 0;

    switch (irpSp->MajorFunction)
    {
    case IRP_MJ_CREATE:
    case IRP_MJ_CLOSE:
        break;

    case IRP_MJ_DEVICE_CONTROL:
        if (irpSp->Parameters.DeviceIoControl.IoControlCode ==
            IOCTL_GET_CPU_JSON)
        {
            size_t jsonLen = strlen(g_LastJson) + 1;

            if (irpSp->Parameters.DeviceIoControl.OutputBufferLength >= jsonLen)
            {
                RtlCopyMemory(
                    Irp->AssociatedIrp.SystemBuffer,
                    g_LastJson,
                    jsonLen
                );

                returnLength = (ULONG_PTR)jsonLen;
            }
            else
            {
                status = STATUS_BUFFER_TOO_SMALL;
            }
        }
        else
        {
            status = STATUS_INVALID_DEVICE_REQUEST;
        }
        break;

    default:
        status = STATUS_INVALID_DEVICE_REQUEST;
        break;
    }

    Irp->IoStatus.Status = status;
    Irp->IoStatus.Information = returnLength;

    IoCompleteRequest(Irp, IO_NO_INCREMENT);

    return status;
}

//
// Timer
//
static VOID TimerRoutine(
    PKDPC Dpc,
    PVOID DeferredContext,
    PVOID SystemArgument1,
    PVOID SystemArgument2)
{
    UNREFERENCED_PARAMETER(Dpc);
    UNREFERENCED_PARAMETER(DeferredContext);
    UNREFERENCED_PARAMETER(SystemArgument1);
    UNREFERENCED_PARAMETER(SystemArgument2);

    if (g_DeviceObject)
    {
        PIO_WORKITEM workItem = IoAllocateWorkItem(g_DeviceObject);

        if (workItem)
        {
            IoQueueWorkItem(
                workItem,
                (PIO_WORKITEM_ROUTINE)ProcessMonitorWorker,
                DelayedWorkQueue,
                workItem
            );
            return;
        }
    }

    KeSetTimer(&Timer, Timeout, &TimerDpc);
}

//
// Unload
//
static VOID DriverUnload(PDRIVER_OBJECT DriverObject)
{
    UNREFERENCED_PARAMETER(DriverObject);

    UNICODE_STRING symLink =
        RTL_CONSTANT_STRING(L"\\??\\CPUMonitor");

    KeCancelTimer(&Timer);

    IoDeleteSymbolicLink(&symLink);

    LARGE_INTEGER interval;
    interval.QuadPart = -2000000;
    KeDelayExecutionThread(KernelMode, FALSE, &interval);

    if (g_DeviceObject)
    {
        IoDeleteDevice(g_DeviceObject);
        g_DeviceObject = NULL;
    }
}

//
// Entry
//
NTSTATUS DriverEntry(
    PDRIVER_OBJECT DriverObject,
    PUNICODE_STRING RegistryPath)
{
    UNREFERENCED_PARAMETER(RegistryPath);

    UNICODE_STRING devName =
        RTL_CONSTANT_STRING(L"\\Device\\CPUMonitor");

    UNICODE_STRING symLink =
        RTL_CONSTANT_STRING(L"\\??\\CPUMonitor");

    NTSTATUS status = IoCreateDevice(
        DriverObject,
        0,
        &devName,
        FILE_DEVICE_UNKNOWN,
        0,
        FALSE,
        &g_DeviceObject
    );

    if (!NT_SUCCESS(status))
        return status;

    status = IoCreateSymbolicLink(&symLink, &devName);

    if (!NT_SUCCESS(status))
    {
        IoDeleteDevice(g_DeviceObject);
        g_DeviceObject = NULL;
        return status;
    }

    for (ULONG i = 0; i < IRP_MJ_MAXIMUM_FUNCTION; i++)
    {
        DriverObject->MajorFunction[i] = GlobalDispatch;
    }

    DriverObject->DriverUnload = DriverUnload;

    KeInitializeTimer(&Timer);
    KeInitializeDpc(&TimerDpc, TimerRoutine, NULL);

    Timeout.QuadPart = -10000000LL; // 1 second

    KeSetTimer(&Timer, Timeout, &TimerDpc);

    return STATUS_SUCCESS;
}