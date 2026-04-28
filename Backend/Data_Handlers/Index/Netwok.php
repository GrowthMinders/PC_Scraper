<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$network = [];
$i = 0;

$interface = "";
$mac = "";
$ip = "";
$subnet = "";
$gateway = "";
$mtu = "";

// Getting All Other Parameters Excluding Latency, Jitter, Packet Loss, ISP 
$ps_cmd = 'powershell "Get-NetIPConfiguration | Where-Object {$_.IPv4DefaultGateway -ne $null} | Select-Object InterfaceAlias, @{N=\'IPv4Address\';E={$_.IPv4Address.IPAddress}}, @{N=\'SubnetMask\';E={(Get-NetIPAddress -InterfaceAlias $_.InterfaceAlias -AddressFamily IPv4).PrefixLength}}, @{N=\'Gateway\';E={$_.IPv4DefaultGateway.NextHop}}, @{N=\'MacAddress\';E={(Get-NetAdapter -InterfaceAlias $_.InterfaceAlias).MacAddress}}, @{N=\'MTU\';E={(Get-NetIPInterface -InterfaceAlias $_.InterfaceAlias -AddressFamily IPv4).NlMtu}} | ConvertTo-Json"';
$raw_data = shell_exec($ps_cmd);

$physical_data = json_decode($raw_data, true);

// Getting the Physical UP Interface
if (isset($physical_data['InterfaceAlias'])) {
    $physical_data = [$physical_data];
}

if (!empty($physical_data)) {
    foreach ($physical_data as $item) {
        
        // Converting PrefixLength to Subnet Mask
        $prefix = $item['SubnetMask'] ?? 32;
        $mask = long2ip(-1 << (32 - (int)$prefix));

        // Getting MAC and formatting it
        $raw_mac = $item['MacAddress'] ?? 'N/A';
        $formatted_mac = str_replace('-', ':', $raw_mac);

        $interface = $item['InterfaceAlias'];
        $mac = $formatted_mac;
        $ip = $item['IPv4Address'];
        $subnet = $mask;
        $gateway = $item['Gateway'];
        $mtu = $item['MTU'] ?? 1500;

    }
}



// Using ipinfo Website For Getting ISP
    $api_url = "http://ipinfo.io";
    $response = @file_get_contents($api_url);
    if ($response) {
        $data = json_decode($response, true);
        $org = $data['org'] ?? 'N/A';
        $organisation = preg_replace('/^AS\d+\s+/i', '', $org);

        $network[] = [
            "mac"       => $formatted_mac,
            "ip"        => $item['IPv4Address'],
            "subnet"    => $mask,
            "gateway"   => $item['Gateway'],
            "mtu"       => $item['MTU'] ?? 1500,
            "isp"       => $organisation
        ];
        $i++;

    }


if($i > 0){
  echo json_encode($network);  
  http_response_code(200);
  exit;
}else{
  http_response_code(400);  
}
?>
