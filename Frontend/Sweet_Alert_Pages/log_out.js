var date = "";
var time = "";
var selector = "";

function param_fixer(){
  const now = new Date();

  const options = {
    timeZone: 'Asia/Colombo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true // Enables AM/PM
  };

  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const parts = formatter.formatToParts(now);

  const dd = parts.find(p => p.type === 'day').value;
  const mm = parts.find(p => p.type === 'month').value;
  const yyyy = parts.find(p => p.type === 'year').value;
  const hh = parts.find(p => p.type === 'hour').value;
  const min = parts.find(p => p.type === 'minute').value;
  const ss = parts.find(p => p.type === 'second').value;
  const ampm = parts.find(p => p.type === 'dayPeriod').value.toUpperCase();

  date = `${dd}/${mm}/${yyyy}`;
  time = `${hh}:${min}:${ss} ${ampm}`;

}


function log_out(){
    Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of your session!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!"
    }).then((result) => {
        if (result.isConfirmed) {
           //Setting The Last Sessions Ended Date, Time and IP Address
           var session_authenticated = sessionStorage.getItem('loged');

           var last_ip = document.getElementById("ip").value;
           param_fixer();

           var log_outer_id = new XMLHttpRequest();
           log_outer_id.open("POST", "api/log_out");
           log_outer_id.setRequestHeader("Content-Type", "application/json");
    
           log_outer_id.onload = function (){
             if(log_outer_id.status == 200){
                var id = JSON.parse(log_outer_id.responseText);

                var log_outer = new XMLHttpRequest();
                log_outer.open("POST", "api/log_out");
                log_outer.setRequestHeader("Content-Type", "application/json");
    
                log_outer.onload = function () {
                  if(log_outer.status == 200) {
                    selector = "out";
                    sessionStorage.removeItem('loged');
            
                    Swal.fire({
                      title: "Logged Out!",
                      text: "Redirecting to login page...",
                      icon: "success",
                      timer: 1500,
                      showConfirmButton: false
                    }).then(() => {
                       window.location.href = 'http://localhost/Scraper/Frontend/HTML/login.html';
                    });
                  }else{
                    Swal.fire({
                      title: 'Profile Verification',
                      text: 'Profile Not Found',
                      icon: 'error',
                      confirmButtonColor: '#e9101085'
                    }).then((result) => {
                      if(result.isConfirmed){
                        Swal.close();
                      }else{
                        Swal.close();
                      }
                   });
                  } 
                };  
                var datacount = {session: id, ip: last_ip, stamp: date+"-"+time, reason: selector};
                var jsonDatacount = JSON.stringify(datacount);
                log_outer.send(jsonDatacount);

             }else{
               Swal.fire({
                 title: 'Oops',
                 text: 'Unable To fetch User Right Now!',
                 icon: 'error',
                 confirmButtonColor: '#e9101085'
               }); 
             }
          };
          log_outer_id.send(session_authenticated);
        }  
    });
}