<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include_once "connection.php";

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$track = $data['track'];
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

  $sql2 = "UPDATE otp_codes SET state = 'deactivated' WHERE uid = $uid AND track = '$track' AND expires_at > NOW() AND state = 'not-used|active' ";

  $query2 = mysqli_query($conn, $sql2);

     if (mysqli_stmt_affected_rows($stmt) > 0) {
       http_response_code(200);
     }else{
       http_response_code(401);
     }

  mysqli_close($conn);  
  exit;   
?>