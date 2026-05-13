<?php
  header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
  header("Access-Control-Allow-Origin: http://localhost:5501"); 
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Access-Control-Allow-Credentials: true");

  include_once "connection.php";

  $track = [];

  //To Use JWT Tokens
  require_once __DIR__ . '/../../vendor/autoload.php';
  use Firebase\JWT\JWT;
  use Firebase\JWT\Key;

  //Environment Variable File 
  $envPath = __DIR__ . '/../../.env'; 

  $json = file_get_contents('php://input');

  $data = json_decode($json, true);

  $hard_detail = 0;
  $soft_detail = 0;
  $inequality = 0;

  if(isset($data['reason'])){
    //Getting User ID
    $id = $data['session'];

    //Getting Hardware Live Data
    $cpu = $data['hard1'];
    $ram = $data['hard2'];
    $int_gpu = $data['hard4'];
    $ext_gpu = $data['hard3'];

    ////Getting OS Related Live Data
    $device = $data['soft1'];
    $win_version = $data['soft2'];
    $build_version = $data['soft3'];
    $last_up = $data['soft4'];
    $license_pro = $data['soft5'];
    $activation = $data['soft6'];


    //Getting Storage Media Data
    $live_storage = $data['hard5'];

    //Comparing Hardware Records 
    $sql1 = "SELECT * FROM hardware_detail WHERE uid = $id ";

    $query1 = mysqli_query($conn, $sql1);

    while($row1 = mysqli_fetch_assoc($query1)){
        if($cpu !== $row1['cpu']){
          $inequality++;
        }     
        if($ram !== $row1['ram']){
          $inequality++;
        }     
        if($int_gpu !== $row1['int_gpu']){
          $inequality++;
        } 
        if($ext_gpu !== $row1['ext_gpu']){
          $inequality++;
        } 

        preg_match_all('/Storage \d+: (.*?)(?=Storage \d+:|$)/', $row1['storages'], $db_drives); 
        $db_storage_list = $db_drives[1];

        preg_match_all('/Storage \d+: (.*?)(?=Storage \d+:|$)/', $live_storage, $drives);
        $media = $drives[1];

        if($db_storage_list !== $media){
          $inequality++;
        }

      $hard_detail++;
    }


    //Comparing OS Records
    $sql2 = "SELECT * FROM software_detail WHERE uid = $id ";

    $query2 = mysqli_query($conn, $sql2);

    while($row2 = mysqli_fetch_assoc($query2)){
        if($device !== $row2['device_name']){
          $inequality++;
        }
        if($win_version !== $row2['win_version']){
          $inequality++;
        }     
        if($build_version !== $row2['build_version']){
          $inequality++;
        }     
        if($last_up !== $row2['last_up']){
          $inequality++;
        } 
        if($license_pro !== $row2['license']){
          $inequality++;
        } 
        if($activation !== $row2['activation']){
          $inequality++;
        } 

      $soft_detail++;
    }

      echo json_encode("Software Details Loaded: ". $soft_detail ." Software Details Loaded: ". $hard_detail);

    if($soft_detail > 0 && $hard_detail > 0){
      http_response_code(200);
    }else{
      http_response_code(404);
    }
    
  }else{

    $stored_session = file_get_contents('php://input');

    //Getting The Secret Key To Needed To Handle The JWT Token
    if (file_exists($envPath)) {
      $env = parse_ini_file($envPath);
      define('JWT_SECRET_KEY', $env['JWT_SECRET_KEY']);
    }

    $secret_key = base64_decode(JWT_SECRET_KEY);

    $userId = 0;

    //Extracting The Logged In Users Session From The JWT Token
    try {
      $decoded = JWT::decode($stored_session, new Key($secret_key, 'HS512'));
      $userId = $decoded->uid;

      $sql = "SELECT last_time, last_ip FROM users WHERE id = $userId ";

      $query = mysqli_query($conn, $sql);

      while($row = mysqli_fetch_assoc($query)){
         $track [] = [
           "ip" => $row['last_ip'],
           "time" => $row['last_time'],
           "id" => $userId
         ];
      }  
      
      echo json_encode($track);
      http_response_code(200);

    } catch (Exception $e) {
      http_response_code(401);
      echo json_encode(["error" => $e->getMessage()]);
      exit;
    }
}

mysqli_close($conn);
exit;
?>