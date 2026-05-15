<?php
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include_once "connection.php";

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$user = $data['action'];

$sql = "SELECT domain_ip, domain FROM network_tester WHERE role = '$user' ";
$query = mysqli_query($conn, $sql);

$tdelay = 0;
$tloss = 0;
$tjitter = 0;
$count = 0;
$domains = [];

while($row = mysqli_fetch_assoc($query)){
    $ip = $row['domain_ip'];

    $domains[] = $row['domain'];
    
    $cmd = "ping -n 5 " . $ip;
    exec($cmd, $output);
    
    $avg= 0;
    $loss = 100;
    $jitter = 0;
    $times = [];
    
    foreach ($output as $line) {
        if (preg_match('/time[<=](\d+)ms/', $line, $matches)) {
            $times[] = (int)$matches[1];
        }

        // FIXED PACKET LOSS PARSING (ONLY CHANGE)
        if (strpos($line, 'loss') !== false || strpos($line, 'Lost') !== false) {
            preg_match('/\((\d+)%\s*loss\)/i', $line, $loss_match);
            if (isset($loss_match[1])) {
                $loss = (int)$loss_match[1];
            }
        }

        if (strpos($line, 'Average') !== false) {
            preg_match('/Average\s*=\s*(\d+)ms/', $line, $avg_match);
            if (isset($avg_match[1])) {
                $avg= (int)$avg_match[1];
            }
        }
    }
    
    $t_count = count($times);
    if ($t_count > 1) {
        $diffs = [];
        for ($k = 0; $k < $t_count - 1; $k++) {
            $diffs[] = abs($times[$k + 1] - $times[$k]);
        }
        $jitter = array_sum($diffs) / count($diffs);
    }
    
    // Accumulate numeric raw values for division later
    $tdelay += $avg;
    $tloss += $loss;
    $tjitter += $jitter;
    $count++;
    
    unset($output);
    
}

if ($count > 0) {
    // Dividing metrics by total count to get overall averages
    $fdelay = round($tdelay / $count, 2);
    $floss = round($tloss / $count, 2);
    $fjitter = round($tjitter / $count, 2);
    
    $response = [
        "domains" => $domains,
        "delay" => $fdelay,
        "latency" => $fdelay,
        "packet_loss" => $floss,
        "jitter" => $fjitter,
        "role" => $user
    ];
    
    http_response_code(200);
    echo json_encode($response);
} else {
    http_response_code(404);
    echo json_encode(["message" => "No records found"]);
}

mysqli_close($conn);
exit;  
?>