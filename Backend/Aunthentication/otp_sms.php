<?php
// ================== DEBUG (REMOVE IN PRODUCTION) ==================
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ================== HEADERS ==================
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include_once 'connection.php';

// ================== GET INPUT ==================
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON input"]);
    exit;
}

$telephone = $data['tel'] ?? null;

if (!$telephone) {
    echo json_encode(["status" => "error", "message" => "Phone number missing"]);
    exit;
}

// ================== TIME ==================
date_default_timezone_set('Asia/Colombo');

// ================== GET USER ID (SAFE) ==================
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

// ================== OTP ==================
$otpCode = rand(100000, 999999); // 6-digit OTP (better UX)
$hashotp = password_hash($otpCode, PASSWORD_BCRYPT);

// Expiry
$expiry = new DateTime();
$expiry->modify('+30 minutes');
$expiry_bd = $expiry->format('Y-m-d H:i:s');

// ================== INSERT OTP ==================
$stmt = $conn->prepare("
    INSERT INTO otp_codes (otp, track, expires_at, attempts, uid, state) 
    VALUES (?, 'sms', ?, 0, ?, 'not-used|active')
");
$stmt->bind_param("ssi", $hashotp, $expiry_bd, $uid);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "OTP insert failed"]);
    exit;
}

// ================== LOAD ENV ==================
$envPath = __DIR__ . '/../../.env';

if (!file_exists($envPath)) {
    echo json_encode(["status" => "error", "message" => ".env file not found"]);
    exit;
}

$env = parse_ini_file($envPath, false, INI_SCANNER_RAW);

if ($env === false) {
    echo json_encode(["status" => "error", "message" => ".env parsing failed"]);
    exit;
}

// Remove hidden BOM characters
$apiKey = preg_replace('/\x{FEFF}/u', '', trim($env['TEXTBEE_API_KEY'] ?? ''));
$deviceId = preg_replace('/\x{FEFF}/u', '', trim($env['TEXTBEE_DEVICE_ID'] ?? ''));

if (!$apiKey || !$deviceId) {
    echo json_encode([
        "status" => "error",
        "message" => "API key or Device ID missing",
        "debug" => $env
    ]);
    exit;
}

// ================== SEND SMS ==================
$payload = json_encode([
    "recipients" => [$telephone],
    "message" => "Your OTP is: $otpCode"
]);

$url = "https://api.textbee.dev/api/v1/gateway/devices/$deviceId/send-sms";

$ch = curl_init($url);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey
    ],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// ================== HANDLE RESPONSE ==================
if ($response === false) {
    echo json_encode([
        "status" => "error",
        "message" => "CURL Error",
        "debug" => curl_error($ch)
    ]);
} else if ($httpCode == 200 || $httpCode == 201) {
    echo json_encode([
        "status" => "success",
        "otp_debug" => $otpCode // REMOVE IN PRODUCTION
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "TextBee API Error",
        "code" => $httpCode,
        "response" => json_decode($response, true)
    ]);
}

curl_close($ch);
mysqli_close($conn);
exit;
?>