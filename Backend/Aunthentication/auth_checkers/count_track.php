<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

  include_once "../../connection.php";

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);

  $track = $data['track'];

  $sql = "";
  $email = "";
  $tel = "";

  if(isset($data['email'])){
    $email = $data['email'];
    $sql = "SELECT id FROM users WHERE email = '$email' ";
  }else{
    $tel = $data['tel'];
    $sql = "SELECT id FROM users WHERE telephone = '$tel' ";
  }  

  $uid = 0;
  $tries = 0;

  $query = mysqli_query($conn, $sql);

  while($row = mysqli_fetch_assoc($query)){
     $uid = $row['id'];
  }

  $sql1 = "UPDATE otp_codes SET attempts = attempts + 1 WHERE uid = $uid AND track = '$track' ";

  $query1 = mysqli_query($conn, $sql1);

  if ($query1) {
    http_response_code(200);
  } else {
    http_response_code(500);    
  }

  mysqli_close($conn);
  exit;
?>
