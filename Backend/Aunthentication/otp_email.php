<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Access-Control-Allow-Origin: http://localhost:5501");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include PHPMailer autoload
require 'C:/xampp/htdocs/Scraper/vendor/autoload.php';
$envPath = __DIR__ . '/../.env'; 

include_once 'connection.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Get the email from the POST request
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$email = $data['email'];

$message = "";

// Check if the email is empty
if (empty($email)) {
    error_log('Email Empty'); // Log the error
    http_response_code(400); // Bad request
    log(2);
    exit(); // Stop further execution
}

$otpCode = rand(100000, 999999);


$name = "";
  
$sql2 = "SELECT fname, lname FROM users WHERE email = '$email' ";

$query2 = mysqli_query($conn, $sql2);

  while($row2 = mysqli_fetch_assoc($query2)){ 
    $name = $row2['fname'] . ' ' . $row2['lname'];
  }


    if(isset($data['trackers'])){
      $message = "Confirm Credential Update Request to approve the changes";
    }else if((!isset($data['trackers'])) && (isset($data['tactic'])) && $data['tactic'] != "delete"){
      $message = "Confirm It's you, Since we received a password change request";
    }else if((!isset($data['trackers'])) && (isset($data['tactic'])) && $data['tactic'] === "delete"){
      $message = "Confirm It's you, Since we received a an account deletion request";
    }else{
      $message = "Please use the one time password below to authorize your account";
    }

// HTML content for the invoice
$invoiceHTML = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 40px;
            color: #444;
        }

        .email-container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border: 1px solid #e0e0e0;
            padding: 40px;
        }

        .header {
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 25px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo-section {
            display: flex;
            flex-direction: column;
        }

        /* Simulating the logo colors */
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #4b8b3b; /* LankaHost Green */
            margin-left: 10px;
        }

        .company-name span {
            color: #2c3e50; /* Web Solutions color */
        }

        .content {
            line-height: 1.6;
            font-size: 15px;
        }

        .otp-display {
            font-size: 18px;
            margin: 20px 0;
            color: #333;
        }

        .system-info {
            margin-top: 25px;
            font-size: 14px;
            color: #555;
        }

        .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #666;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
          <div class="container mt-4">
            <div class="d-flex align-items-center">
             <!-- Logo Section -->
             <div class="me-3">
                <center><img src="https://1drv.ms/i/c/d1ec707daa45f29c/IQRxDFdOmKZjRbe9y_nEehplAZwEpxWmpEJz4Q8gA0eoTwk" 
                   alt="Logo" 
                   style="height: 100px; width: 120px;" 
                   class="img-fluid">
                </center>
             </div>
        
             <!-- Detail Section -->
             <div>
               <center><h1 class="company-name mb-0" style="color: #6a8c4e; font-size: 2.5rem;">
                Sri Dedunu Tech Solutions
               </h1></center>

               <p class="mb-0" style="font-size: 1.25rem; color: #333;">
                <strong>PC Scraper:</strong> The Ultimate Solution For Complex Network And Hardware Management Support
               </p>
             </div>
            </div>
          </div>
        </div>

        <div class="content">
            <p>Dear {$name},</p>
            
            <p>{$message}</p>
            <p>Use these OTP code to log in to the account. This OTP will expire in 30 minutes.</p>
            
            <div class="otp-display">
                <strong>{$otpCode}</strong>
            </div>

        </div>

        <div class="footer">
            <strong>Sri Dedunu Tech Solutions</strong><br>
            304/F, Kindelpitiya, Katukurunda Road, Welmilla<br>
            Bandaragama, Sri Lanka
        </div>
    </div>
</body>
</html>
HTML;


  date_default_timezone_set('Asia/Colombo');

  //// user_id, otp code, track{sms, what, mail}, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP NOT NULL, attempts
  $uid = 0;

  $sql = "SELECT id FROM users WHERE email = '$email' ";

  $query = mysqli_query($conn, $sql);

  while($row = mysqli_fetch_assoc($query)){ 
    $uid = $row['id'];
  }


  $now = new DateTime();

  $expiry = clone $now;
  $expiry->modify('+30 minutes');

  $expiry_bd = $expiry->format('Y-m-d H:i:s');

  $hashotp = password_hash($otpCode, PASSWORD_BCRYPT);
  $sql1 = "INSERT INTO otp_codes (otp, track, expires_at, attempts, uid, state) VALUES ('$hashotp', 'mail', '$expiry_bd', 0, $uid, 'not-used|active')";

  $query1 = mysqli_query($conn, $sql1);

  if($query1 == true){
    // Create a new PHPMailer instance
     $mail = new PHPMailer(true);

       if (file_exists($envPath)) {
          $env = parse_ini_file($envPath);
          define('EMAIL_HOST', $env['EMAIL_HOST']);
          define('EMAIL_PASSWORD', $env['EMAIL_PASSWORD']);
          define('EMAIL_USERNAME', $env['EMAIL_USERNAME']);
          define('EMAIL_PORT', $env['EMAIL_PORT']);
          define('EMAIL_SMTPSecure', $env['EMAIL_SMTPSecure']);
       }

     try {
       // Server settings
       $mail->isSMTP();
       $mail->Host = EMAIL_HOST;
       $mail->SMTPAuth = true;
       $mail->Username = EMAIL_USERNAME;
       $mail->Password = EMAIL_PASSWORD;
       $mail->SMTPSecure = EMAIL_SMTPSecure;
       $mail->Port = EMAIL_PORT;
       $mail->SMTPDebug = 2; // Enable debugging

       // Recipients
       $mail->setFrom('sridedunutechsolutions@gmail.com', 'Sri Dedunu Tech Solutions');
       $mail->addAddress($email);

       // Content
       $mail->isHTML(true);
       $mail->Subject = 'OTP Code';
       $mail->Body = $invoiceHTML;

       // Send the email
         if ($mail->send()) {
           http_response_code(200);
         } else {
           echo json_encode(array("status" => "error", "message" => "Mail not sent"));
           http_response_code(500);
         }

     } catch (Exception $e) {
       echo json_encode(array("status" => "error", "message" => "Mailer Error: {$mail->ErrorInfo}"));
       http_response_code(500);
     }

  }else{
    http_response_code(404);
  }

mysqli_close($conn);
exit;
?>