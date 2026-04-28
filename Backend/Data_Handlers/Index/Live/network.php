<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

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
http_response_code(200);
exit;

?>