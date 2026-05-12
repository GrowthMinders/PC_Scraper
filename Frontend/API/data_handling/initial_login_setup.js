function new_user_setup(){
    var loader = document.getElementById("spinner");
    var loading_state = document.getElementById("status-msg");

    var session_authenticated = sessionStorage.getItem('loged');

    var pc_data_grab = new XMLHttpRequest();
    pc_data_grab.open("POST", "api/initial_setup");
    pc_data_grab.setRequestHeader("Content-Type", "application/json");
    
    pc_data_grab.onload = function () {
        if(pc_data_grab.status == 200) {
          setTimeout(() => {
             loading_state.innerText = "Gathering Device Details";
          }, 2000);

          setTimeout(() => {
             loading_state.innerText = "The Initial Setup Stage Was A Success";
          }, 5000);

          setTimeout(() => {
             loading_state.innerText = "Redirecting to Dashboard";
          }, 8000);

          setTimeout(() => {
            window.location.href = "http://localhost/Scraper/index.html";
          }, 10000);


        } else {
          Swal.fire({
            title: 'Initial Setup Manager',
            text: 'The Intial Setup Failed Partially!',
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
    pc_data_grab.send(session_authenticated);

}

new_user_setup();