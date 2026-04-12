<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include_once 'connection.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$telephone1 = $data['tel'];
$telephone = "+94" . ltrim($telephone1, "0");

date_default_timezone_set('Asia/Colombo');

$uid = 0;

$sql = "SELECT id FROM users WHERE telephone = '$telephone1' ";

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
$sql1 = "INSERT INTO otp_codes (otp, track, expires_at, attempts, uid, state) VALUES ('$hashotp', 'what', '$expiry_bd', 0, $uid, 'not-used|active')";

$query1 = mysqli_query($conn, $sql1);


if($query1 == true){
  $message = "Your OTP is: " . $otpCode;

  // 1. Path to npx (Ensure this is correct for your PC)
  $npxPath = "C:\\Program Files\\nodejs\\npx.cmd"; 

  // Path to login data
  $cachePath = "C:\\Users\\Supun\\AppData\\Local\\mudslide\\Data";

  // 3. Add the --cache flag to the command
  $command = "\"$npxPath\" mudslide --cache \"$cachePath\" send $telephone \"$message\" 2>&1";

  $output = shell_exec($command);

  echo "<pre>System Output: $output</pre>";

  if(strpos($output, 'success') !== false){
    echo "WhatsApp OTP sent successfully!";
  }else{
    echo "Failed to send WhatsApp message.";
  }
}

mysqli_close($conn);
?>
