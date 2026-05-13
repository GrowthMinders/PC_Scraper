// Session Testing To check Legidimity Of User 
var caller = "";

window.valid = function() {
    const popoverElement = document.getElementById('profilers');
    const instance = bootstrap.Popover.getInstance(popoverElement);
    if (instance) instance.hide();

    var session_authenticated = sessionStorage.getItem('loged');
    var origin = window.location.href;

    var session_validation = new XMLHttpRequest();
    session_validation.open("POST", "api/session_verify");
    session_validation.setRequestHeader("Content-Type", "application/json");
    
    session_validation.onload = function () {
        if(session_validation.status == 200) {
           if(origin == "http://localhost/Scraper/index.html"){
             if(caller === "prof"){
               profile();
             }else if(caller === "chg_pass"){
               change_password();
             }else if(caller === "export"){
               reporter();  
             }else{
               log_out();
             }
           } 
        } else {
          Swal.fire({
            title: 'Profile Verified',
            text: 'Invalid Session!',
            icon: 'error',
            confirmButtonColor: '#e9101085'
          }).then((result) => {
             if(result.isConfirmed){
               window.location.href = "Frontend/HTML/login.html";
             }else{
               window.location.href = "Frontend/HTML/login.html"; 
             }
          });
        }  
    };
    session_validation.send(session_authenticated);
};

document.addEventListener('click', function (e) {
    caller = e.target.id;
    if ((e.target && e.target.id === 'prof') || (e.target && e.target.id === 'chg_pass') || (e.target && e.target.id === 'log') || (e.target && e.target.id === 'export')) {
        window.valid();
    }
});