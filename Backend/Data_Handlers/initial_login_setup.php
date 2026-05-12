<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

  include_once "connection.php";

  //Including The Files Which rReturns The Hardware And OS Details
  $output1 = file_get_contents("http://localhost/Scraper/Backend/Data_Handlers/Index/Operating.php");
  $output2 = file_get_contents("http://localhost/Scraper/Backend/Data_Handlers/Index/Hardware_stats.php");
  $output3 = file_get_contents("http://localhost/Scraper/Backend/Data_Handlers/Index/Network.php");

  $value = json_decode($output1, true);
  $value1 = json_decode($output2, true);
  $value2 = json_decode($output3, true);

  $hardware_names = $value1['hardware']; // Extracts the hardware array
  $storage_info   = $value1['storage'];  // Extracts the storage array

  $userId = 0;
  $okay = 0;

  require_once __DIR__ . '/../../../vendor/autoload.php';
  use Firebase\JWT\JWT;
  use Firebase\JWT\Key;

  $envPath = __DIR__ . '/../../../.env'; 

  $json = file_get_contents('php://input');

  $stored_session = $json; 

    if (file_exists($envPath)) {
      $env = parse_ini_file($envPath);
      if(!defined('JWT_SECRET_KEY')) define('JWT_SECRET_KEY', $env['JWT_SECRET_KEY']);
    }

    $secret_key = base64_decode(JWT_SECRET_KEY);
    

    try {
       $decoded = JWT::decode($stored_session, new Key($secret_key, 'HS512'));
       $userId = $decoded->uid;

       $sql = "SELECT last_time, last_ip FROM users WHERE id = $userId ";
       $query = mysqli_query($conn, $sql);
       while($row = mysqli_fetch_assoc($query)){
          if($row['last_time'] != "0" && $row['last_time'] != "0"){
             $okay = 1;
          }
       }

    } catch (Exception $e) {
       http_response_code(401);
       echo json_encode(["error" => $e->getMessage()]);
       exit;
    }



      function insert_details(){
         global $conn, $value2, $userId;

         //IP Adderess
         $detail1 = $value2[0];

         $datezone = new DateTime("now", new DateTimeZone('Asia/Colombo'));
         $date = $datezone->format('d/m/Y');
         $time = $datezone->format('h:i:s A');

         $sql3 = "UPDATE users SET last_time = '$date .'-'. $time' last_ip = '{$detail1['ip']}'  WHERE id = $userId ";
         $query3 = mysqli_query($conn, $sql3);

      }



    if($userId != 0 && $okay == 0){
      //Hardware Details
      $detail = $value[0];
            
      //Tracking Last Logged Hardware 
      $sql1 = "INSERT INTO hardware_detail (cpu, ram, int_gpu, ext_gpu, storages, uid) VALUES ('$hardware_names[0]', '$hardware_names[3]', '$hardware_names[1]', '$hardware_names[2]', '$hardware_names[0]', $userId)";

      $query1 = mysqli_query($conn, $sql1);

        if($query1 == false){
          http_response_code(402);
          exit;
        } 
          
      //Tracking OS Details Of Last Logged Device      
      $sql2 = "INSERT INTO software_detail (device_name, win_version, build_version, last_up, license, activation, uid) VALUES ('{$detail['device_name']}', '{$detail['windows_version']}', '{$detail['build_version']}', 
                                                                                                                                '{$detail['last_update']}', '{$detail['activation']}', '{$detail['license_info']}', $userId)";

      $query2 = mysqli_query($conn, $sql2);

        if($query2 == false){
          http_response_code(403);
          exit;
        }

      //Updating The IP Address And Last Log Time/Date  
      insert_details(); 
      http_response_code(200);

    }else{
      //Updating The IP Address And Last Log Time/Date  
      insert_details();
      http_response_code(200);
    }

  mysqli_close($conn);
  exit;
?>