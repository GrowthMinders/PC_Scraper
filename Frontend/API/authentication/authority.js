var session_authenticated = sessionStorage.getItem('loged');

function validity(){
  var session_validation = new XMLHttpRequest();
  session_validation.open("POST", "api/session_verify");
  session_validation.setRequestHeader("Content-Type", "application/json");
    
  session_validation.onload = function () {
    if(session_validation.status !== 200) {
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
}

validity();

let lastRun = Date.now();

setInterval(() => {
  const now = Date.now();
  if (now - lastRun >= 1800000) {
    validity();
    lastRun = now;
  }
}, 60000);


