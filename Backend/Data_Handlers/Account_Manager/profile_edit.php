<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include_once "connection.php";

  //To Use JWT Tokens
  require_once __DIR__ . '/../../../vendor/autoload.php';
  use Firebase\JWT\JWT;
  use Firebase\JWT\Key;

  //Environment Variable File 
  $envPath = __DIR__ . '/../../../.env'; 

  $json = file_get_contents('php://input');

  $data = json_decode($json, true);
    
  if(isset($data['id']) && isset($data['email']) && isset($data['tel'])){
    $ids = $data['id'];
    $email = $data['email'];
    $tel = $data['tel'];

    $sql = "UPDATE users SET email = '$email', telephone = '$tel' WHERE id = $ids ";
    $query = mysqli_query($conn, $sql);

    if(mysqli_affected_rows($conn) > 0){
      http_response_code(200);
    }

  }else{
    $stored_session = file_get_contents('php://input');

    if (file_exists($envPath)) {
      $env = parse_ini_file($envPath);
      define('JWT_SECRET_KEY', $env['JWT_SECRET_KEY']);
    }

    $secret_key = base64_decode(JWT_SECRET_KEY);

    $userId = 0;

    //Extracting The Logged In Users Session From The JWT Token
    try {
       $decoded = JWT::decode($stored_session, new Key($secret_key, 'HS512'));
       $userId = $decoded->uid;
       http_response_code(200);
       echo json_encode($userId);
    } catch (Exception $e) {
       http_response_code(401);
       echo json_encode(["error" => $e->getMessage()]);
       exit;
    }
  }  

mysqli_close($conn);
exit;
?>