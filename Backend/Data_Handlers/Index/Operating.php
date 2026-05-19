<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$soft = [];
$i = 0;

$device = "";
$win = "";
$build = "";

try {
    $object_wmi = new COM("winmgmts:{impersonationLevel=impersonate}!\\\\.\\root\\cimv2");

   //Getting Last Updated Date
    $updates = $object_wmi->ExecQuery("SELECT InstalledOn FROM Win32_QuickFixEngineering");
    $lastUpdateTimestamp = 0;
    $actualUpdateDate = "Unknown";

    foreach ($updates as $update) {
        $val = (string)$update->InstalledOn;
        if (!empty($val)) {
            // Some updates return hex FILETIME, others return standard date strings
            $ts = (ctype_xdigit($val) && strlen($val) == 16) 
                ? ($val / 10000000) - 11644473600 // Rough Hex to Unix conversion
                : strtotime($val);

            if ($ts > $lastUpdateTimestamp) {
                $lastUpdateTimestamp = $ts;
                $actualUpdateDate = date("d-m-Y", $ts);
                
            }
        }
    }

//Getting OS Activation Details
$licenseProvider = "Unknown";
$activationStatus = "Unlicensed";

$command = "cscript //NoLogo C:\\Windows\\System32\\slmgr.vbs /dli";
$output = @shell_exec($command);

if ($output) {
    if (stripos($output, "License Status: Licensed") !== false) {
        $activationStatus = "Activated/Genuine";
        
        // If it is activated via a KMS bypass/crack, override the status
        if (stripos($output, "VOLUME_KMSCLIENT") !== false) {
            $activationStatus = "KMS Activated (Possible Volume/Non-Retail)";
        }
    }

    if (stripos($output, "RETAIL channel") !== false) {
        $licenseProvider = "Retail Channel";
    } elseif (stripos($output, "OEM") !== false) {
        $licenseProvider = "OEM Channel (Factory Built)";
    } elseif (stripos($output, "VOLUME_KMSCLIENT") !== false) {
        $licenseProvider = "Volume KMS Client";
    }
}


    //Getting Device Name, OS Version, Built Version, OS Version 
    $os = $object_wmi->ExecQuery("SELECT * FROM Win32_OperatingSystem");
    foreach ($os as $OS) {
        $device = $OS->CSName;
        $win = $OS->Caption;
        $build = $OS->Version;

        $soft[] = [
            "device_name"     => (string)$OS->CSName,
            "windows_version" => (string)$OS->Caption,
            "build_version"   => (string)$OS->Version,
            "last_update"     => $actualUpdateDate,
            "activation"      => $activationStatus,
            "license_info"    => $licenseProvider
        ];
        $i++;
    }

    if ($i > 0) {
       echo json_encode($soft);
       http_response_code(200);
       exit;
    } else {
       http_response_code(400);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

?>
