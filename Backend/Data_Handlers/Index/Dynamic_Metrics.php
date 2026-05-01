<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$component = $data['hardware'];

if($component === "cpu"){

  $exePath = "C:\\xampp\\htdocs\\Scraper\\Driver_Executers\\cpumonitor_client.exe";

  if (!file_exists($exePath)) {
    echo json_encode(["error" => "EXE not found"]);
    exit;
  }

  exec('"' . $exePath . '" 2>&1', $output, $code);

  $raw = trim(implode("\n", $output));

  $json = null;

  foreach ($output as $line) {
    $line = trim($line);

    if (strpos($line, "{") === 0) {
        $json = $line;
        break;
    }
  }

  if (!$json) {
    echo json_encode([
        "error" => "no JSON found",
        "raw" => $raw,
        "code" => $code
    ]);
    exit;
  }

  $data = json_decode($json, true);

  if (!is_array($data)) {
    echo json_encode([
        "error" => "invalid JSON",
        "raw" => $json
    ]);
    exit;
  }

  echo json_encode([
    "load_percent"   => $data["cpu_load"] ?? 0,
    "precision_load" => $data["precision_load"] ?? "0.00",
    "uptime"         => $data["uptime"] ?? "00:00:00:00",
  ]);

}else if($component === "ram"){

  $ram = [];

  $freeRamKB = trim(shell_exec('powershell -Command "(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory"'));
  $freeGB = number_format(((float)$freeRamKB * 1024) / (1024**3), 1);

    $ram [] = [
      "free_ram_gb" => $freeGB,
    ];

  echo json_encode($ram);

}else if($component === "gpu"){

  $exePath = "C:/xampp/htdocs/Scraper/Driver_Executers/gpumonitor_client.exe";
 
  if (!file_exists($exePath)) {
    echo json_encode(["error" => "EXE not found at path: " . $exePath]);
    exit;
  }

  $rawOutput = shell_exec('"' . $exePath . '" 2>&1');

  if ($rawOutput === null) {
    echo json_encode(["error" => "Failed to execute EXE"]);
    exit;
  }

  $start = strpos($rawOutput, '{');
  $end = strrpos($rawOutput, '}');

  if ($start === false || $end === false) {
    echo json_encode([
        "error" => "No valid JSON structure found",
        "raw_output" => $rawOutput
    ]);
    exit;
  }

  $jsonString = substr($rawOutput, $start, ($end - $start) + 1);

  $data = json_decode($jsonString, true);

  if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "error" => "JSON decode failed",
        "msg" => json_last_error_msg(),
        "cleaned_string" => $jsonString
    ]);
    exit;
  }

  echo json_encode($data["gpus"] ?? []);

}else{

  $net_data = [];

  try {
    $wmi = new COM("winmgmts://./root/CIMV2");
    $net = $wmi->ExecQuery("
        SELECT Name, BytesSentPerSec, BytesReceivedPerSec
        FROM Win32_PerfFormattedData_Tcpip_NetworkInterface
    ");
    foreach ($net as $n) {
        $name = $n->Name;
        if (stripos($name, "loopback") !== false ||
            stripos($name, "isatap") !== false ||
            stripos($name, "teredo") !== false) continue;
        
        $send_kbps = $n->BytesSentPerSec / 1024;
        $recv_kbps = $n->BytesReceivedPerSec / 1024;
        
        $net_data[] = [
            "adapter" => $name,
            "send_kbps" => round($send_kbps, 2),
            "receive_kbps" => round($recv_kbps, 2),
            "total_kbps" => round($send_kbps + $recv_kbps, 2)
        ];
    }
  } catch (Exception $e) {
    $net_data = ["error" => $e->getMessage()];
  }

  echo json_encode($net_data);

}

http_response_code(200);
exit;
?>