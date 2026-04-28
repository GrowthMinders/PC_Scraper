<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$gpu_soft = [];
$i = 0;

$tmpFile = sys_get_temp_dir() . '\dxcap.txt';
shell_exec("dxdiag /t $tmpFile");

$attempts = 0;
while (!file_exists($tmpFile) && $attempts < 10) {
    usleep(500000);
    $attempts++;
}

$dx_version = "Unknown";
if (file_exists($tmpFile)) {
    $content = file_get_contents($tmpFile);
    if (preg_match('/DirectX Version: (.*)/', $content, $matches)) {
        $dx_version = trim($matches[1]);
    }
    unlink($tmpFile);
}

$gpu_cmd = 'powershell -command "Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion | ConvertTo-Json"';
$gpu_json = shell_exec($gpu_cmd);
$gpu_data = json_decode($gpu_json, true);

if (isset($gpu_data['Name'])) $gpu_data = [$gpu_data];

if ($gpu_data) {
    foreach ($gpu_data as $index => $gpu) {
       $gpu_soft[$index] = [
          "name"    => $gpu['Name'],
          "driver"  => $gpu['DriverVersion'],
          "directx" => $dx_version
       ];
      $i++;
    }
}

echo json_encode([$gpu_soft, $i]);
http_response_code(200);
exit;

?>
