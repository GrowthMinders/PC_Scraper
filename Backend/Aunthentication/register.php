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

  $femail = "";

  $sql = "SELECT email FROM users WHERE email = '$email' ";

  $query = mysqli_query($conn, $sql);

  while($row = mysqli_fetch_assoc($query)){
    $femail = $row['email'];
  }

 if($femail === ""){
    $hashpass = password_hash($pass, PASSWORD_BCRYPT);
    $sql1 = "INSERT INTO users (fname, lname, email, pass, uname) VALUES ('$fname', '$lname', '$email', '$hashpass', '$uname')";

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
?>