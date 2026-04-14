<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$hardware_names = [];
$storage = [];

$i = 0;
$w = 0;

//WMI(Windows Management Instrumentals To Extract HArdware Details)
try {
    // Connect to WMI service on local machine
    $wmi = new COM("winmgmts:{impersonationLevel=impersonate}//./root/cimv2");

    //Getting OF CPU NAme
    $cpus = $wmi->ExecQuery("SELECT Name, LoadPercentage FROM Win32_Processor");
    foreach ($cpus as $cpu) {
        $hardware_names[$i] = $cpu->Name;
        $i++;
    }

    //Getting External GPU Details
    $psCommand = 'powershell -Command "$GPU = Get-ItemProperty -Path \"HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000\"; $VRAM_Bytes = $GPU.\"HardwareInformation.qwMemorySize\"; $GPU_Name = $GPU.\"HardwareInformation.AdapterString\"; $VRAM_GB = [math]::round($VRAM_Bytes / 1GB); echo \"$GPU_Name $VRAM_GB GB\""';
    
    $gpu_info = shell_exec($psCommand);
    if ($gpu_info) {
        $hardware_names[$i] = trim($gpu_info);
        $i++;
    }

    //Getting Internal GPU Detais
    $psCommand = 'powershell -Command "Get-CimInstance Win32_VideoController | Where-Object { $_.Name -match \'Intel|AMD Graphics|UHD|Iris\' -and $_.Name -notmatch \'NVIDIA|Radeon RX\' } | ForEach-Object { $gb = [math]::round($_.AdapterRAM / 1GB); echo ($_.Name + \" \" + $gb + \" GB\") }"';
    
    $internal_gpu = shell_exec($psCommand);
    
    if ($internal_gpu) {
        $hardware_names[$i] = trim($internal_gpu);
        $i++;
    }


    // Getting RAM Details
    $memInfo = $wmi->ExecQuery("SELECT Capacity, SMBIOSMemoryType FROM Win32_PhysicalMemory");

    $typeMap = [
      0  => 'Unknown',
      20 => 'DDR',
      21 => 'DDR2',
      24 => 'DDR3',
      26 => 'DDR4',
      28 => 'DDR5',
      34 => 'DDR5'
    ];

    $totalCapacityBytes = 0;
    $ddr_version = "Unknown";

    foreach ($memInfo as $mem) {

     $totalCapacityBytes += (float)$mem->Capacity;

        $typeValue = $mem->SMBIOSMemoryType;
          if (isset($typeMap[$typeValue])) {
             $ddr_version = $typeMap[$typeValue];
          }
    }

    $totalGB = ceil($totalCapacityBytes / (1024**3));

    $hardware_names[$i] = $totalGB . " GB " . $ddr_version;
    $i++;



    // Getting Storage Media Detailsk
    $smartctl = '"C:\Program Files\smartmontools\bin\smartctl.exe"';

    $scan_output = shell_exec("$smartctl --scan");

    if ($scan_output) {
      $lines = explode("\n", trim($scan_output));
    
      foreach ($lines as $line) {
        // Look for the device path (e.g., /dev/pd0)
        if (preg_match('/\/dev\/(\w+)/', $line, $matches)) {
            $device_path = $matches[0];
            
            // 2. Get info for this specific drive in JSON format (-j)
            // -i gets info, -j makes it easy for PHP to read
            $info_json = shell_exec("$smartctl -i -j $device_path");
            $data = json_decode($info_json, true);
            
            if (isset($data['model_name'])) {
                $model = $data['model_name'];
                $size_bytes = $data['user_capacity']['bytes'] ?? 0;
                $size_gb = round($size_bytes / (1024**3), 2);
                
                // Identify Type
                $family = $data['model_family'] ?? '';
                $type = (stripos($model, 'NVMe') !== false || stripos($family, 'NVMe') !== false) ? "NVMe SSD" : "Disk";

                $storage[] = "$model | $type | $size_gb GB";
            }
        }
      }
    } 

    if($i > 0){
      http_response_code(200);
      echo json_encode([
        "hardware" => $hardware_names,
        "storage"  => $storage
      ]);  
    }else{
      http_response_code(400);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}

?>
