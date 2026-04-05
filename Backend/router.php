<?php 
  $request = $_SERVER['REQUEST_URI'];
  $BASE_URL = 'C:\\xampp\\htdocs\\Scraper\\Backend\\';

    switch($request){
        case '/Scraper/Frontend/HTML/api/register' :
           require $BASE_URL.'Aunthentication\\register.php';
           break;
        case '/Scraper/Frontend/HTML/api/login' :
           require $BASE_URL.'Aunthentication\\login.php';
           break;
        case '/api/scrape' :
           require __DIR__.'/API/scrape.php';
           break;
        default:
           http_response_code(500);
        break;
    }
?>
