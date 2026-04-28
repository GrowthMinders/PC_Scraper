<?php

header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Content-Type: application/json");

http_response_code(200);

// ---- EXE PATH ----
$exePath = "C:\\xampp\\htdocs\\Scraper\\Driver_Executers\\cpumonitor_client.exe";

if (!file_exists($exePath)) {
    echo json_encode(["error" => "EXE not found"]);
    exit;
}

// ---- RUN EXE DIRECTLY (NO POWERSHELL) ----
exec('"' . $exePath . '" 2>&1', $output, $code);

// combine output
$raw = trim(implode("\n", $output));

// ---- FIND JSON LINE ----
$json = null;

foreach ($output as $line) {
    $line = trim($line);

    if (strpos($line, "{") === 0) {
        $json = $line;
        break;
    }
}

// ---- VALIDATION ----
if (!$json) {
    echo json_encode([
        "error" => "no JSON found",
        "raw" => $raw,
        "code" => $code
    ]);
    exit;
}

// ---- DECODE ----
$data = json_decode($json, true);

if (!is_array($data)) {
    echo json_encode([
        "error" => "invalid JSON",
        "raw" => $json
    ]);
    exit;
}

// ---- OPTIONAL SYSTEM INFO ----
$cpu_cores = trim(shell_exec('powershell -Command "(Get-CimInstance Win32_Processor).NumberOfCores"'));
$cpu_threads = trim(shell_exec('powershell -Command "(Get-CimInstance Win32_Processor).NumberOfLogicalProcessors"'));

// ---- RESPONSE ----
echo json_encode([
    "load_percent"   => $data["cpu_load"] ?? 0,
    "precision_load" => $data["precision_load"] ?? "0.00",
    "uptime"         => $data["uptime"] ?? "00:00:00:00",
    "cores"          => $cpu_cores,
    "threads"        => $cpu_threads
]);

exit;
?>