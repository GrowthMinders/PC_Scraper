<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

  //To Use JWT Tokens
  require_once __DIR__ . '/../../../vendor/autoload.php';
  use Firebase\JWT\JWT;
  use Firebase\JWT\Key;

  //Environment Variable File 
  $envPath = __DIR__ . '/../../../.env'; 

  $stored_session = file_get_contents('php://input');

  //Getting The Secret Key To Needed To Handle The JWT Token
  if (file_exists($envPath)) {
    $env = parse_ini_file($envPath);
    define('JWT_SECRET_KEY', $env['JWT_SECRET_KEY']);
  }

  $secret_key = base64_decode(JWT_SECRET_KEY);

  //Checking The Signature Of The Session
try {
    $decoded = JWT::decode($stored_session, new Key($secret_key, 'HS512'));
    http_response_code(200);
    echo json_encode(["status" => "success"]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => $e->getMessage()]);
}

?>