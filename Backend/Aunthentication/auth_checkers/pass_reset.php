<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

  include_once "connection.php";

  mysqli_query($conn, "SET time_zone = '+05:30'");

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);

  $email = ""; 
  
  if(isset($data['email'])){
    $email = $data['email'];
  }

  $track = $data['track'];

  if($track === "pass_link"){
      $sql = "SELECT email FROM users WHERE email = '$email' ";
      $result = mysqli_query($conn, $sql);
      $row = mysqli_fetch_assoc($result);

      if($row){
        http_response_code(200);
      }else{
        http_response_code(402);
      }

  }else{
     
    $new_password = $data['pass'];
    $token = $data['ticket'];
    $email = $data['email'];
    $uid = 0;
    $dbtoken = "";

    $sql = "SELECT id FROM users WHERE email = '$email' ";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);

    if($row){
     $uid = $row['id'];

     $sql1 = "SELECT otp FROM otp_codes WHERE uid = $uid AND track = 'password_reset' AND expires_at > NOW() AND state = 'not-used|active' ";

     $query1 = mysqli_query($conn, $sql1);

     while($row1 = mysqli_fetch_assoc($query1)){
        $dbtoken = $row1['otp'];
     }

     if(password_verify($token, $dbtoken)){
       //Updateing The Password
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        $sql3 = "UPDATE users SET pass = '$hashed_password' WHERE email = '$email' ";

        $query3 = mysqli_query($conn, $sql3);

        if($query3 == true) {
           //Changing Token State To Used
           $sql2 = "UPDATE otp_codes SET state = 'used' WHERE uid = $uid AND track = 'password_reset' AND expires_at > NOW() AND state = 'not-used|active' ";

           $query2 = mysqli_query($conn, $sql2);

           if ($query2 == true) {
              http_response_code(200);
           }else{
              //Making The Link Expired()
              $sql4 = "UPDATE otp_codes SET state = 'expired' WHERE uid = $uid AND track = 'password_reset' AND expires_at > NOW() AND state = 'not-used|active' ";

              $query4 = mysqli_query($conn, $sql4);

              if ($query4 == true) {
                 http_response_code(401); // Token expiration
              }

           }

        }else{
          http_response_code(500); // password update failure
        }

     }else{
       //Making The Link Expired()
        $sql4 = "UPDATE otp_codes SET state = 'expired' WHERE uid = $uid AND track = 'password_reset' AND expires_at > NOW() AND state = 'not-used|active' ";

        $query4 = mysqli_query($conn, $sql4);

        if ($query4 == true) {
          http_response_code(401); // Token expiration
        }
     }
 
    }

  }

  mysqli_close($conn);
?>