#include <windows.h>
#include <iostream>

int main() {

    HANDLE hDevice = CreateFileA(
        "\\\\.\\CPUMonitor",
        GENERIC_READ | GENERIC_WRITE,
        0, NULL, OPEN_EXISTING, 0, NULL
    );

    if (hDevice == INVALID_HANDLE_VALUE) {
        std::cout << "{\"error\":\"open_failed\",\"code\":" << GetLastError() << "}";
        return 1;
    }

    char buffer[512] = {0};
    DWORD bytes = 0;

    BOOL ok = DeviceIoControl(
        hDevice,
        CTL_CODE(FILE_DEVICE_UNKNOWN, 0x800, METHOD_BUFFERED, FILE_ANY_ACCESS),
        NULL, 0,
        buffer, sizeof(buffer),
        &bytes,
        NULL
    );

    if (!ok) {
        std::cout << "{\"error\":\"ioctl_failed\",\"code\":" << GetLastError() << "}";
        CloseHandle(hDevice);
        return 1;
    }

    CloseHandle(hDevice);

    if (bytes == 0) {
        std::cout << "{\"error\":\"no_data\"}";
        return 1;
    }

    buffer[bytes] = '\0';

    std::cout << buffer;
    return 0;
}