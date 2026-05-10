<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

  include_once "connection.php";

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);

  $id = $data['user'];

  //First Deleting the OTP records
  $delete_otp = "DELETE FROM otp_codes WHERE uid = $id ";
  mysqli_query($conn, $delete_otp);

  //Deleting The Account
  $sql = "DELETE FROM users WHERE id = $id ";

  $query = mysqli_query($conn, $sql);

  if($query == false){ 
     http_response_code(404);
     exit;
  }else{
     http_response_code(200);
  }  

  mysqli_close($conn);
  exit;
?>
