<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

  include_once "connection.php";

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);

  $found = "";

  $sql = "";
  $email = "";
  $tel = "";

  if(isset($data['email'])){
    $email = $data['email'];
    $sql = "SELECT email FROM users WHERE email = '$email' ";
    
    $query = mysqli_query($conn, $sql);

    while($row = mysqli_fetch_assoc($query)){
      $found = $row['email'];
    }

  }else{
    $tel = $data['tel'];
    $sql = "SELECT telephone FROM users WHERE telephone = '$tel' ";
    
    $query = mysqli_query($conn, $sql);

    while($row = mysqli_fetch_assoc($query)){
      $found = $row['telephone'];
    }
  
  }

  if($found != ""){
    http_response_code(200);
  }else{
    http_response_code(404);
  }

  mysqli_close($conn);
  exit;
?>