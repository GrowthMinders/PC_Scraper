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

  mysqli_query($conn, "SET time_zone = '+05:30'");

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);

  $sql = "";
  $email = "";
  $tel = "";
  $uid = 0;

  if(isset($data['email'])){
    $email = $data['email'];
    $sql = "SELECT id FROM users WHERE email = '$email' ";
    $query = mysqli_query($conn, $sql);

    while($row = mysqli_fetch_assoc($query)){
      $uid = $row['id'];
    }
  }else{
    $tel = $data['tel'];
    $sql = "SELECT id FROM users WHERE telephone = '$tel' ";
    $query = mysqli_query($conn, $sql);

    while($row = mysqli_fetch_assoc($query)){
      $uid = $row['id'];
    }
  }

  $track = $data['track'];
  $otp = $data['otp'];

  $otp_code = "";

  $sql1 = "SELECT otp FROM otp_codes WHERE uid = $uid AND track = '$track' AND expires_at > NOW() AND state = 'not-used|active' ";

  $query1 = mysqli_query($conn, $sql1);

  while($row1 = mysqli_fetch_assoc($query1)){
     $otp_code = $row1['otp'];
  }

  if(password_verify($otp, $otp_code)){
     $sql2 = "UPDATE otp_codes SET state = 'used' WHERE uid = $uid AND track = '$track' AND expires_at > NOW() AND state = 'not-used|active' ";

     $query2 = mysqli_query($conn, $sql2);

     if ($query2 == true) {
      //Creating The JWT Token
      //Getting The Secret Key To Needed To Handle The JWT Token
       if (file_exists($envPath)) {
          $env = parse_ini_file($envPath);
          define('JWT_SECRET_KEY', $env['JWT_SECRET_KEY']);
       }

      //Creation Of The Token
      $secret_key = base64_decode(JWT_SECRET_KEY);

      $payload = [
        "issued" => time(),
        "exp" => time() + 9000,
        "uid" => $uid
      ];

      $jwt = Firebase\JWT\JWT::encode($payload, $secret_key, 'HS512');

       echo json_encode(["token" => $jwt]); 
       http_response_code(200);
     }else{
       http_response_code(401);
     }

  }else{
     http_response_code(404);
  }  

  mysqli_close($conn);
  exit;
?>
