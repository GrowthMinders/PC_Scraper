<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include_once 'connection.php';
$envPath = __DIR__ . '/../../.env'; 
 
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// 1. Get Data from JS
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$telephone = $data['tel'] ?? null;

date_default_timezone_set('Asia/Colombo');

$uid = 0;

$sql = "SELECT id FROM users WHERE telephone = '$telephone' ";

$query = mysqli_query($conn, $sql);

  while($row = mysqli_fetch_assoc($query)){ 
    $uid = $row['id'];
  }


$now = new DateTime();

$expiry = clone $now;
$expiry->modify('+30 minutes');

$expiry_bd = $expiry->format('Y-m-d H:i:s');

$otpCode = rand(1000000000, 9999999999);

$hashotp = password_hash($otpCode, PASSWORD_BCRYPT);
$sql1 = "INSERT INTO otp_codes (otp, track, expires_at, attempts, uid, state) VALUES ('$hashotp', 'sms', '$expiry_bd', 0, $uid, 'not-used|active')";

$query1 = mysqli_query($conn, $sql1);

if(!$telephone){
  die(json_encode(["status" => "error", "message" => "Phone number missing"])); 
}

if($query1 == true){
   // Make it look like a friendly notification
   $messageText = "Dear user, sign in using these credential: {$otpCode}";

   if (file_exists($envPath)) {
     $env = parse_ini_file($envPath);
     define('SMS_PHONE_IP', $env['SMS_PHONE_IP']);
     define('SMS_PASSWORD', $env['SMS_PASSWORD']);
     define('SMS_USER', $env['SMS_USER']);
   }

   $phoneIp = SMS_PHONE_IP;
   $user = SMS_USER;
   $pass = SMS_PASSWORD;

   // 3. Prepare Payload (The app expects an array for phoneNumbers)
   $payload = json_encode([
      "message" => $messageText,
      "phoneNumbers" => [$telephone],
      "simIndex" => 1 // 0 for SIM 1, 1 for SIM 2
   ]);

   // 4. Send Directly via cURL (Bypasses library issues)
   $ch = curl_init("http://$phoneIp/message");
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($ch, CURLOPT_POST, true);
   curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
   curl_setopt($ch, CURLOPT_HTTPHEADER, [
      'Content-Type: application/json',
      'Authorization: Basic ' . base64_encode("$user:$pass")
   ]);

   $response = curl_exec($ch);
   $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
   curl_close($ch);

   // 5. Response to JS
   if($httpCode == 200 || $httpCode == 202){
      echo json_encode(["status" => "success"]);
   }else{
      echo json_encode([
        "status" => "error", 
        "message" => "Phone unreachable. Code: $httpCode", 
        "debug" => $response
      ]);
   }
}

mysqli_close($conn);
?>
