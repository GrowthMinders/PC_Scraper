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
           

        //Getting Hardware Details 
        case '/Scraper/api/hard_names' :
           require $BASE_URL.'Data_Handlers\\Index\\Hardware_stats.php'; //To Display On The small 1 Banner [Section 1] 
           break; 

         
        //Getting Operating System Details     
        case '/Scraper/api/operating' :
           require $BASE_URL.'Data_Handlers\\Index\\Operating.php'; //To Display On The small 2 Banner [Section 1]
           break;
           

        //Getting Network Details     
        case '/Scraper/api/networker' :
           require $BASE_URL.'Data_Handlers\\Index\\Netwok.php'; //To Display On The small 3 Banner [Section 1]
           break;


        //Getting All Data Of Live Matrix Analyzer [Section 2]  
        case '/Scraper/api/hard_stat' :
           require $BASE_URL.'Data_Handlers\\Index\\Static_Metrics.php'; //Getting The Static Data About The Hardware 
           break;

        case '/Scraper/api/hard_dyna' :
           require $BASE_URL.'Data_Handlers\\Index\\Dynamic_Metrics.php'; //Getting The Dynamic Data About The Hardware
           break;
         

        //User Management
        case '/Scraper/api/profile' :
           require $BASE_URL.'Data_Handlers\\Account_Manager\\profile.php'; //Fetching Profile User Data
           break;

        case '/Scraper/api/profile_update' :
           require $BASE_URL.'Data_Handlers\\Account_Manager\\profile_edit.php'; //Email and Telephone Number Updating
           break;
           
        case '/Scraper/api/change_password' :
           require $BASE_URL.'Data_Handlers\\Account_Manager\\change_password.php'; //User Password Changing 
           break; 

        case '/Scraper/api/delete_profile' :
           require $BASE_URL.'Data_Handlers\\Account_Manager\\delete_profile.php'; //Profile Deletion Script      
           break;    

        case '/Scraper/api/log_out' :
           require $BASE_URL.'Data_Handlers\\Account_Manager\\logout.php'; //Logging Out Script      
           break;      


        //User Management (OTP Section)    
        case '/Scraper/api/check_alert' :
           require $BASE_URL.'Aunthentication\\auth_checkers\\detail_check.php'; //Email Address, Whatsapp Number, SMS Number Checker (Password Changing and Profile Updating)
           break;

        case '/Scraper/api/otp_alert' :
           require $BASE_URL.'Aunthentication\\auth_checkers\\otp_check.php'; //OTP Verification Script (Password Changing and Profile Updating)
           break;

        case '/Scraper/api/count_alert' :
           require $BASE_URL.'Aunthentication\\auth_checkers\\count_track.php'; //OTP Failed Attempts Tracker (Password Changing and Profile Updating)
           break;

        case '/Scraper/api/otp_deactivate_alert' :
           require $BASE_URL.'Aunthentication\\auth_checkers\\otp_deactivator.php'; //OTP Deactivation Script (Password Changing and Profile Updating)
           break;

        case '/Scraper/api/otp_mail_alert' :
           require $BASE_URL.'Aunthentication\\otp_email.php'; //Email Sending Script (Password Changing and Profile Updating)
           break;  

        case '/Scraper/api/otp_sms_alert' :
           require $BASE_URL.'Aunthentication\\otp_sms.php'; //SMS Sending Script (Password Changing and Profile Updating)
           break;  
           
        case '/Scraper/api/otp_whatsapp_alert' :
           require $BASE_URL.'Aunthentication\\otp_whatsapp.php'; //WhatsApp Message Sending Script (Password Changing and Profile Updating)
           break; 


        //DB Data Talier And Difeerennce Notifier   
        case '/Scraper/api/db_tally' :
           require $BASE_URL.'Data_Handlers\\db_comparison.php'; //Hardware Before And After Comparison Script

        case '/Scraper/Frontend/HTML/api/initial_setup' :
           require $BASE_URL.'Data_Handlers\\initial_login_setup.php'; //Initial Login User Device Data Colletion Script  
       

        //Getting Network Quality Details    
        case '/Scraper/api/ping' :
           require $BASE_URL.'Data_Handlers\\Index\\Pinger.php'; //To Display Network Packetloss, Delay Jitter and ect
           break;   

        //Getting The Health And The Recmmendation Engine Details
        case '/Scraper/api/recommender' :
           require $BASE_URL.'Data_Handlers\\Index\\recommendation.php'; //To Display Network Packetloss, Delay Jitter and ect
           break;  



        default:
           http_response_code(500);
        break;
    }
?>