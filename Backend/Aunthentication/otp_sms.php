<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include_once 'connection.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON input"]);
    exit;
}

$telephone = str_replace('+94', '0', $data['tel']);

if (!$telephone) {
    echo json_encode(["status" => "error", "message" => "Phone number missing"]);
    exit;
}

date_default_timezone_set('Asia/Colombo');


$stmt = $conn->prepare("SELECT id FROM users WHERE telephone = ?");
$stmt->bind_param("s", $telephone);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$row = $result->fetch_assoc();
$uid = $row['id'];



$otpCode = rand(100000, 999999);
$hashotp = password_hash($otpCode, PASSWORD_BCRYPT);

$expiry = new DateTime();
$expiry->modify('+30 minutes');
$expiry_bd = $expiry->format('Y-m-d H:i:s');



$stmt = $conn->prepare("
    INSERT INTO otp_codes (otp, track, expires_at, attempts, uid, state) 
    VALUES (?, 'sms', ?, 0, ?, 'not-used|active')
");
$stmt->bind_param("ssi", $hashotp, $expiry_bd, $uid);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "OTP insert failed"]);
    exit;
}



$envPath = __DIR__ . '/../../.env';

if (!file_exists($envPath)) {
    echo json_encode(["status" => "error", "message" => ".env file not found at " . $envPath]);
    exit;
}


$env = parse_ini_file($envPath);

$api = $env['HTTPSMS_API_KEY'];
$phone = $env['HTTPSMS_NUMBER'];



require __DIR__ . '/../../vendor/autoload.php';
use GuzzleHttp\Client;

$telephone = preg_replace('/^0/', '+94', $telephone);

try {
    $client = new Client();
    $url = "https://api.httpsms.com/v1/messages/send";

$response = $client->post($url, [
    'headers' => [
        'x-api-key'    => $api,
        'Content-Type' => 'application/json',
        'Accept'       => 'application/json'
    ],
    'json' => [
        'from'    => $phone,
        'to'      => $telephone,
        'content' => "Login Using The Below Credential: $otpCode"
    ],
    'http_errors' => true
]);

    $body = json_decode($response->getBody(), true);

    echo json_encode([
        "status"      => "success",
        "message"     => "OTP sent via httpSMS Cloud",
        "otp_debug"   => $otpCode
    ]);

} catch (GuzzleHttp\Exception\ClientException $e) {
    $error_body = (string) $e->getResponse()->getBody();
    echo json_encode([
        "status"  => "error",
        "message" => "httpSMS API Error: " . $e->getMessage(),
        "details" => json_decode($error_body, true)
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status"  => "error",
        "message" => "System Error: " . $e->getMessage()
    ]);
}

mysqli_close($conn);
exit;
?>
