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

    //Getting License State And Genuinity
    $licenseData = $object_wmi->ExecQuery("SELECT LicenseStatus, Description FROM SoftwareLicensingProduct WHERE PartialProductKey IS NOT NULL");
    $activationStatus = "Unlicensed";
    $licenseType = "Unknown";

    foreach ($licenseData as $license) {
        // LicenseStatus 1 = Licensed (Activated)
        if ($license->LicenseStatus == 1) {
            $activationStatus = "Activated/Genuine";
            $licenseType = (string)$license->Description;
            
            // Heuristic for cracked versions: KMS activators often show "VOLUME_KMSCLIENT" 
            // on home/personal machines
            if (stripos($licenseType, "KMS") !== false) {
                $activationStatus = "KMS Activated (Possible Volume/Non-Retail)";
            }
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
            "license_info"    => $licenseType
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
