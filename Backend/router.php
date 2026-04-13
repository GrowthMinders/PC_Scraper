<?php 
  $request = $_SERVER['REQUEST_URI'];
  $BASE_URL = 'C:\\xampp\\htdocs\\Scraper\\Backend\\';

    switch($request){
        case '/Scraper/Frontend/HTML/api/register' :
           require $BASE_URL.'Aunthentication\\register.php'; //Registration Script
           break;
        case '/Scraper/Frontend/HTML/api/login' :
           require $BASE_URL.'Aunthentication\\login.php'; //Login Script
           break;

        //OTP Checking and OTP Managing Scripts
        case '/Scraper/Frontend/HTML/api/check' :
           require $BASE_URL.'Aunthentication\\auth_checkers\\detail_check.php'; //Email Address, Whatsapp Number, SMS Number Checker
           break;

        case '/Scraper/Frontend/HTML/api/otp' :
           require $BASE_URL.'Aunthentication\\auth_checkers\\otp_check.php'; //OTP Verification Script
           break;

        case '/Scraper/Frontend/HTML/api/count' :
           require $BASE_URL.'Aunthentication\\auth_checkers\\count_track.php'; //OTP Failed Attempts Tracker
           break;

        case '/Scraper/Frontend/HTML/api/otp_deactivate' :
           require $BASE_URL.'Aunthentication\\auth_checkers\\otp_deactivator.php'; //OTP Deactivation Script
           break;

        //OTP Sending Scripts For Loging In 
        case '/Scraper/Frontend/HTML/api/otp_mail' :
           require $BASE_URL.'Aunthentication\\otp_email.php'; //Email Sending Script
           break;  

        case '/Scraper/Frontend/HTML/api/otp_sms' :
           require $BASE_URL.'Aunthentication\\otp_sms.php'; //SMS Sending Script
           break;  
           
        case '/Scraper/Frontend/HTML/api/otp_whatsapp' :
           require $BASE_URL.'Aunthentication\\otp_whatsapp.php'; //WhatsApp Message Sending Script
           break; 

        //Password Reset Scripts
        case '/Scraper/Frontend/HTML/api/password_reset_send' :
           require $BASE_URL.'Aunthentication\\passreset_email.php'; //Link Sending Script
           break; 

        case '/Scraper/Frontend/HTML/api/password_reset' :
           require $BASE_URL.'Aunthentication\\auth_checkers\\pass_reset.php'; //Password Reseting Script
           break;
        
        //Session Checker
        case '/Scraper/api/session_verify' :
           require $BASE_URL.'Aunthentication\\auth_checkers\\authenticate.php'; //Checking Session Legidimity 
           break;   

        default:
           http_response_code(500);
        break;
    }
?>