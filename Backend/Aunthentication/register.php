<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

  include_once "connection.php";

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);

  $fname = $data['fname'];
  $email = $data['email'];
  $uname = $data['uname'];
  $pass =  $data['pass'];
  $lname = $data['lname'];
  $tel = $data['tel'];

  $femail = "";
  $funame = "";
  $ftel = "";

  $sql = "SELECT email FROM users WHERE email = '$email' ";

  $query = mysqli_query($conn, $sql);

  while($row = mysqli_fetch_assoc($query)){
    $femail = $row['email'];
  }


  $sql2 = "SELECT uname FROM users WHERE uname = '$uname' ";

  $query2 = mysqli_query($conn, $sql2);

  while($row2 = mysqli_fetch_assoc($query2)){
    $funame = $row2['uname'];
  }

  $sql3 = "SELECT telephone FROM users WHERE telephone = '$tel' ";

  $query3 = mysqli_query($conn, $sql3);

  while($row3 = mysqli_fetch_assoc($query3)){
    $ftel = $row3['telephone'];
  }


  if($funame != ""){
    http_response_code(403);
  }

  if($ftel != ""){
    http_response_code(402);
  }



 if($femail === "" && $funame === ""){
    $hashpass = password_hash($pass, PASSWORD_BCRYPT);
    $sql1 = "INSERT INTO users (fname, lname, email, pass, uname, telephone, last_time, last_ip) VALUES ('$fname', '$lname', '$email', '$hashpass', '$uname', '$tel', '0', '0')";

    $query1 = mysqli_query($conn, $sql1);

    if($query1 == true){
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