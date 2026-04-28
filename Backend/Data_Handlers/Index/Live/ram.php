<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$ram = [];

$freeRamKB = trim(shell_exec('powershell -Command "(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory"'));
$freeGB = number_format(((float)$freeRamKB * 1024) / (1024**3), 1);

$usedSlots = trim(shell_exec('powershell -Command "(Get-CimInstance Win32_PhysicalMemory | Measure-Object).Count"'));
$totalSlots = trim(shell_exec('powershell -Command "(Get-CimInstance Win32_PhysicalMemoryArray).MemoryDevices"'));
$formFactorRaw = trim(shell_exec('powershell -Command "(Get-CimInstance Win32_PhysicalMemory)[0].FormFactor"'));

$formFactorMap = [
    0 => "Unknown", 8 => "DIMM", 12 => "SODIMM"
];
$formFactor = $formFactorMap[(int)$formFactorRaw] ?? "Unknown";
    
    $ram [] = [
      "free_ram_gb" => $freeGB,
      "form_factor" => $formFactor,
      "slots_used" => $usedSlots . " of " . $totalSlots
    ];

echo json_encode($ram);
http_response_code(200);
exit;

?>