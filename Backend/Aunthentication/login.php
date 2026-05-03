<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

  include_once "connection.php";

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);

  $uname = $data['uname'];
  $pass = $data['pass'];

  $sql = "SELECT pass FROM users WHERE uname = '$uname' ";

  $query = mysqli_query($conn, $sql);

  if($query == false){ 
     http_response_code(404);
     exit;
  }

  if($row = mysqli_fetch_assoc($query)){
     $dbpass = $row['pass'];

     if(password_verify($pass, $dbpass)){
        http_response_code(200); 
     }else{
        http_response_code(404);
     }
  }else{
     http_response_code(401);
  }   

  mysqli_close($conn);
  exit;
?>
