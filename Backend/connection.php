<?php
   $envPath = __DIR__ . '/../.env'; 

   //Getting Access to .env credentials
   if (file_exists($envPath)) {
       $env = parse_ini_file($envPath);
       define('DB_HOST', $env['DB_HOST']);
       define('DB_USER', $env['DB_USER']);
       define('DB_PASS', $env['DB_PASS']);
       define('DB_NAME', $env['DB_NAME']);
   }

   $conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

   if($conn == false){
     echo "Error: " . mysqli_connect_error();
   }
?>
