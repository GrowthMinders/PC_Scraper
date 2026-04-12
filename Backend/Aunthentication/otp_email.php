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

// Check if the email is empty
if (empty($email)) {
    error_log('Email Empty'); // Log the error
    http_response_code(400); // Bad request
    log(2);
    exit(); // Stop further execution
}

$otpCode = rand(1000000000, 9999999999);

// HTML content for the invoice
$invoiceHTML = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Code</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f8f8f8;
            margin: 0;
            padding: 20px;
            color: #333;
        }

        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            overflow: hidden;
        }

        .invoice-header {
            background: green;
            color: white;
            padding: 30px;
        }

        .restaurant-name {
            font-size: 32px;
            font-weight: 700;
            margin: 0;
            letter-spacing: 1px;
        }

        .invoice-title {
            font-size: 24px;
            margin: 10px 0 0;
            font-weight: 600;
        }

        .invoice-logo {
            text-align: center;
            margin-top: 20px;
        }

        .invoice-info {
            display: flex;
            flex-direction: center;
            align-items: center;
            text-align: center;
            padding: 20px 30px;
            border-bottom: 1px solid #eee;
        }

        .info-section {
            margin: 8px 0;
        }

        .info-label {
            font-weight: 600;
            color: #666;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .info-value {
            font-size: 16px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
        }

        .items-table th {
            background-color: #f5f5f5;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #555;
        }

        .items-table td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }

        .items-table tr:last-child td {
            border-bottom: none;
        }

        .text-right {
            text-align: right;
        }

        .total-section {
            padding: 20px 30px;
            background-color: #f9f9f9;
            border-top: 1px solid #eee;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .total-label {
            font-weight: 600;
        }

        .grand-total {
            font-size: 20px;
            color: #ff6b6b;
            font-weight: 700;
        }

        .footer {
            padding: 20px 30px;
            text-align: center;
            color: #777;
            font-size: 14px;
            border-top: 1px solid #eee;
        }

        .thank-you {
            font-size: 18px;
            color: #ff6b6b;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .item-name {
            font-weight: 600;
        }

        .item-desc {
            font-size: 13px;
            color: #777;
            margin-top: 3px;
        }

        .reset-link {
            display: block;
            margin: 20px 0;
            padding: 10px;
            background: #f0f0f0;
            border-left: 4px solid #ff6b6b;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <h1 class="restaurant-name">OTP Code: {$otpCode}</h1>
        </div>
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
?>