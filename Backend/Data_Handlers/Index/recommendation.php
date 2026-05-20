<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");


include_once "connection.php";

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$user = $data['action'];

$soft = [];
$i = 0;
$tot_loss = 0;

$active = "";
$genuine = "";
$update_status = "";

$sql = "SELECT domain_ip FROM network_tester WHERE role = '$user'";
$query = mysqli_query($conn, $sql);

$disp_loss = "";
$count = 0;

while ($row = mysqli_fetch_assoc($query)) {

    $ip = $row['domain_ip'];

    $cmd = "ping -n 5 " . escapeshellarg($ip);
    exec($cmd, $output);

    $loss = 100;

    foreach ($output as $line) {
        if (preg_match('/\((\d+)%\s*loss\)/i', $line, $match)) {
            $loss = (int)$match[1];
        }
    }

    $tot_loss += $loss;

    $disp_loss = $tot_loss . "%";
    $count++;

    unset($output);
}

$avgLoss = ($count > 0) ? ($tot_loss / $count) : 0;


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


$timezone = new DateTimeZone('Asia/Colombo');

$dateToTest = (new DateTime('now', $timezone))->setTimestamp($ts)->modify('00:00:00');

$sevenDaysAgo = (new DateTime('7 days ago', $timezone))->modify('00:00:00');

if ($dateToTest >= $sevenDaysAgo) {
    $update_status = "current";
} else {
    $update_status = "non-current";
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

        if($activationStatus = "Activated/Genuine"){
           $active = "yes";
           $genuine = "yes";
        }else{
           $active = "yes";
           $genuine = "no"; 
        }
    }

        $soft[] = [
            "active"     => $active,
            "genuine" => $genuine,
            "update_status"   => $update_status,
            "loss" => $disp_loss
        ];
        $i++;

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
