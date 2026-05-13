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

$total_delay = 0;
$total_packet_loss = 0;
$total_jitter = 0;
$count = 0;
$domains = [];

while($row = mysqli_fetch_assoc($query)){
    $ip = $row['domain_ip'];

    $domains[] = $row['domain'];
    
    $cmd = "ping -n 5 " . $ip;
    exec($cmd, $output);
    
    $avg_time_num = 0;
    $loss_num = 100;
    $jitter_num = 0;
    $times = [];
    
    foreach ($output as $line) {
        if (preg_match('/time[<=](\d+)ms/', $line, $matches)) {
            $times[] = (int)$matches[1];
        }
        if (strpos($line, 'Loss') !== false) {
            preg_match('/\((\d+)%\s+loss\)/', $line, $loss_match);
            if (isset($loss_match[1])) {
                $loss_num = (int)$loss_match[1];
            }
        }
        if (strpos($line, 'Average') !== false) {
            preg_match('/Average\s*=\s*(\d+)ms/', $line, $avg_match);
            if (isset($avg_match[1])) {
                $avg_time_num = (int)$avg_match[1];
            }
        }
    }
    
    $t_count = count($times);
    if ($t_count > 1) {
        $diffs = [];
        for ($k = 0; $k < $t_count - 1; $k++) {
            $diffs[] = abs($times[$k + 1] - $times[$k]);
        }
        $jitter_num = array_sum($diffs) / count($diffs);
    }
    
    // Accumulate numeric raw values for division later
    $total_delay += $avg_time_num;
    $total_packet_loss += $loss_num;
    $total_jitter += $jitter_num;
    $count++;
    
    unset($output);
    
}

if ($count > 0) {
    // Divide metrics by total count to get overall averages
    $final_delay = round($total_delay / $count, 2);
    $final_packet_loss = round($total_packet_loss / $count, 2);
    $final_jitter = round($total_jitter / $count, 2);
    
    $response = [
        "tested_domains" => $domains,
        "average_delay" => $final_delay . "ms",
        "average_latency" => $final_delay . "ms",
        "average_packet_loss" => $final_packet_loss . "%",
        "average_jitter" => $final_jitter . "ms",
        "average_throughput" => ($final_packet_loss == 100)
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
