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
$diskinfo_log = 'C:\Program Files\CrystalDiskInfo\DiskInfo.txt';

// Silently trigger the data generation bypassing Apache's Session 0 desktop isolation blocks
if (!file_exists($diskinfo_log) || (time() - filemtime($diskinfo_log) > 60)) {
    shell_exec('powershell -WindowStyle Hidden -Command "Start-Process \'C:\Program Files\CrystalDiskInfo\DiskInfo64.exe\' -ArgumentList \'/CopyExit\' -Wait"');
}

if (file_exists($diskinfo_log)) {
    $scan_output = file_get_contents($diskinfo_log);
    
    if ($scan_output) {
        // Split the log file into individual disk sections separated by line dividers
        $disks = explode("----------------------------------------------------------------------------", $scan_output);
        
        foreach ($disks as $disk_data) {
            // Check for valid disk blocks containing the clean Model data structure line
            if (preg_match('/Model\s*:\s*([^\n]+)/', $disk_data, $model_match)) {
                // Fix: Grab index [1] from regex array group to prevent string conversion crash
                $model = trim($model_match[1]);
                
                // Extract disk capacities safely 
                $size_gb = 0;
                if (preg_match('/Disk Size\s*:\s*([0-9\.]+)\s*GB/', $disk_data, $size_match)) {
                    // Fix: Grab index [1] from regex array group
                    $size_gb = round((float)$size_match[1], 2);
                }
                
                // Identify Type from the interface line inside this disk section
                $type = "Disk";
                if (preg_match('/Interface\s*:\s*([^\n]+)/', $disk_data, $interface_match)) {
                    // Fix: Grab index [1] from regex array group
                    if (stripos($interface_match[1], 'NVM Express') !== false || stripos($model, 'NVMe') !== false) {
                        $type = "NVMe SSD";
                    }
                }
                
                $storage[] = "$model | $type | $size_gb GB";
            }
        }
    }
}


    if($i > 0){
      echo json_encode([
        "hardware" => $hardware_names,
        "storage"  => $storage
      ]);
      http_response_code(200);
      exit;  
    }else{
      http_response_code(400);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}

?>
