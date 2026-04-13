 var session_authenticated = sessionStorage.getItem('loged');

 // Session Testing To check Legidimity Of User 
 var session_validation = new XMLHttpRequest();
 session_validation.open("POST", "api/session_verify");
 session_validation.setRequestHeader("Content-Type", "application/json");
 session_validation.onload = function () {
    if(session_validation.status == 401){
         Swal.fire({
           title: "Oops!",
           text: "Invalid Sesssion Detected!",
           icon: "info",
           confirmButtonText: "OK" 
         }).then((result) => {
            if(result.isConfirmed){
              window.location.href = "http://localhost/Scraper/Frontend/HTML/login.html"; 
            }else{
              window.location.href = "http://localhost/Scraper/Frontend/HTML/login.html"; 
            }
         });       
    }
 };
 session_validation.send(session_authenticated);
