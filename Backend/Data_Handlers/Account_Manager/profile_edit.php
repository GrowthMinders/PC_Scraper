<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include_once "connection.php";

$db_details = []; // Fixed typo from $bd_details
$id = 0;

  require_once __DIR__ . '/../../../vendor/autoload.php';
  use Firebase\JWT\JWT;
  use Firebase\JWT\Key;

  $envPath = __DIR__ . '/../../../.env'; 

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);

  $ids = 0;
  if(isset($data['id'])){
     $ids = (int)$data['id'];
  }

  if(isset($data['trackers'])){
    if($data['trackers'] === "email"){
      
      $email = $data['email'];
      
      $sql = "UPDATE users SET email = '$email' WHERE id = $ids ";
      $query = mysqli_query($conn, $sql);

      if($query){
        http_response_code(200);
      }else{
        http_response_code(500); // Added status code for clarity
        echo json_encode([
          "status" => "error",
          "error_info" => mysqli_error($conn),
          "sql_executed" => $sql
       ]);
      }

    }else{
      $tel = $data['tel'];

      $sql = "UPDATE users SET telephone = '$tel' WHERE id = $ids ";
      $query = mysqli_query($conn, $sql);

      if($query === true){
        http_response_code(200);
      }else{
        http_response_code(500);
        echo json_encode([
          "status" => "error",
          "error_info" => mysqli_error($conn),
          "sql_executed" => $sql
       ]);
      }
    }
    
  } else if((!isset($data['trackers'])) && (isset($data['unames']))){
     $user = $data['unames'];
     
     $sql = "SELECT id, email FROM users WHERE uname = '$user' ";
     $query = mysqli_query($conn, $sql);

      while($row = mysqli_fetch_assoc($query)){
        $db_details[] = [
          "id" => $row["id"]
        ];
      }

       http_response_code(200);
       echo json_encode($db_details);

  }else{

    $stored_session = $json; 

    if (file_exists($envPath)) {
      $env = parse_ini_file($envPath);
      if(!defined('JWT_SECRET_KEY')) define('JWT_SECRET_KEY', $env['JWT_SECRET_KEY']);
    }

    $secret_key = base64_decode(JWT_SECRET_KEY);
    $userId = 0;

    try {
       $decoded = JWT::decode($stored_session, new Key($secret_key, 'HS512'));
       $userId = $decoded->uid;

         $sql = "SELECT email, telephone FROM users WHERE id = $userId ";
         $query = mysqli_query($conn, $sql);

         while($row = mysqli_fetch_assoc($query)){
           $db_details[] = [
             "email" => $row["email"],
             "tel" => $row["telephone"],
             "id" => $userId
           ];
         }

       http_response_code(200);
       echo json_encode($db_details);
    } catch (Exception $e) {
       http_response_code(401);
       echo json_encode(["error" => $e->getMessage()]);
       exit;
    }
  }  

mysqli_close($conn);
exit;
?>
