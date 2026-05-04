function profile(){
  var session_authenticated = sessionStorage.getItem('loged');

  const regexmail = /^[A-Za-z\d]{4,40}(@)(outlook\.com|yahoo\.com|gmail\.com)$/;
  
  const regextel = /^(\+94)(70|71|72|73|74|75|76|77|78)([0-9]{7})$/;
  const regextel1 = /^(\+94)(777)([0-9]{6})$/;
  const regextel2 = /^(070|071|072|073|074|075|076|077|078)([0-9]{7})$/;
  const regextel3 = /^(0777)([0-9]{6})$/;

  var profile_fetch = new XMLHttpRequest();
  profile_fetch.open("POST", "api/profile");
  profile_fetch.setRequestHeader("Content-Type", "application/json");
    
  profile_fetch.onload = function () {
    if(profile_fetch.status == 200){
      var data = JSON.parse(profile_fetch.responseText);

      var edit = 0;
      var prev_input_memory = "";
      var input_memory = "";

      var instance = data[0];
 
      Swal.fire({
        title: "User Profile",
        html: `
         <div style="text-align: center; padding: 10px;">

          <div style="margin-bottom: 20px;">
            <img src="http://localhost/Scraper/Frontend/ASSETS/DP.avif" 
               style="border-radius: 50%; width: 120px; height: 120px; object-fit: cover;" 
               alt="Avatar">
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
        
            <input type="text" id="uname" class="swal2-input" style="width: 350px; margin: 0;" value="${instance.uname}" readonly>
        
            <input type="text" id="name" class="swal2-input" style="width: 350px; margin: 0;" value="${instance.fname + " " + instance.lname}" readonly>

          <div style="display: flex; align-items: center; width: 350px; justify-content: center;">
            <input type="text" id="email" class="swal2-input" style="width: 350px; margin: 0;" value="${instance.email}" readonly>
            <i class="fa fa-pencil editor" target="email" style="font-size: 20px; color: blue; cursor: pointer; margin-left: 15px;"></i>
          </div>

          <div style="display: flex; align-items: center; width: 350px; justify-content: center;">
            <input type="text" id="tel" class="swal2-input" style="width: 350px; margin: 0;" value="${instance.telephone}" readonly>
            <i class="fa fa-pencil editor" target="tel" style="font-size: 20px; color: blue; cursor: pointer; margin-left: 15px;"></i>
          </div>

          </div>
         </div>`,
    
        didOpen: () => {
          
            const edits = document.querySelectorAll(".editor");
            const btn = Swal.getConfirmButton();

            edits.forEach((icon) => {
              icon.addEventListener("click", function () {
               if(prev_input_memory !== ""){
                  prev_input_memory = input_memory;
                  const tracked = this.getAttribute("target");
                  input_memory = document.getElementById(tracked);
               }else{
                  const tracked = this.getAttribute("target");
                  input_memory = document.getElementById(tracked);
               }

                if(edit == 0){
                  prev_input_memory = input_memory;
                  if(input_memory.hasAttribute("readonly")){
                    input_memory.removeAttribute("readonly");
                    input_memory.focus();

                    btn.innerText = 'Save';
                    btn.style.backgroundColor = '#28a745';
                    edit++;
                  }

                }else{ 
                  prev_input_memory.setAttribute("readonly", "true");
                  prev_input_memory.blur(); 
                  
                  input_memory.removeAttribute("readonly");
                  input_memory.focus();

                  btn.innerText = 'Save';
                  btn.style.backgroundColor = '#28a745';
                  edit++;
                }
              });
            });
          
          btn.addEventListener("click", function () {
            if(prev_input_memory !== "" || input_memory !== ""){
             var email = document.getElementById("email").value;
             var tel = document.getElementById("tel").value;

             if(email === "" || tel === ""){
               Swal.fire({
                 title: 'Oops',
                 text: 'All Fields Are Required!',
                 icon: 'error',
                 confirmButtonColor: '#e9101085'
               });
             }else if(!regexmail.test(email)){
               Swal.fire({
                 title: 'Oops',
                 text: 'Only Outlook, Yahoo and Gmail Accounts Are Allowed!',
                 icon: 'error',
                 confirmButtonColor: '#e9101085'
               });
             }else if(!regextel.test(tel) && !regextel1.test(tel) && !regextel2.test(tel) && !regextel3.test(tel)){
               Swal.fire({
                 title: 'Oops',
                 text: 'Invalid Phone Number!',
                 icon: 'error',
                 confirmButtonColor: '#e9101085'
               });
             }else{
               var profile_id_grab = new XMLHttpRequest();
               profile_id_grab.open("POST", "api/profile_update");
               profile_id_grab.setRequestHeader("Content-Type", "application/json");
    
               profile_id_grab.onload = function () {
                 if(profile_id_grab.status == 200){
                    var ids = JSON.parse(profile_id_grab.responseText);

                    var profile_update = new XMLHttpRequest();
                    profile_update.open("POST", "api/profile_update");
                    profile_update.setRequestHeader("Content-Type", "application/json");
    
                    profile_update.onload = function () {
                      if(profile_update.status == 200){
                        Swal.fire({
                         title: 'Done',
                         text: 'Account Details Successfully Edited',
                         icon: 'success',
                         confirmButtonColor: '#1ad4439c'
                        }).then((result) => {
                           profile(); 
                        });
                      }else{
                       Swal.fire({
                        title: 'Oops',
                        text: 'Unable to update account details at these moment',
                        icon: 'error',
                        confirmButtonColor: '#e9101085'
                       }); 
                      }  
                   };
                   var params = {id:ids, email:email, tel:tel};
                   var jsonparams = JSON.stringify(params);
                   profile_update.send(jsonparams);
                  
                 }else{
                   Swal.fire({
                    title: 'Oops',
                    text: 'Unable To fetch User Right Now!',
                    icon: 'error',
                    confirmButtonColor: '#e9101085'
                   }); 
                 }
               };
               profile_id_grab.send(session_authenticated);
             }
            }
          });  

        },
      }); 
    

    }else if(profile_fetch.status == 401){
      Swal.fire({
        title: 'Profile',
        text: 'Invali Request!',
        icon: 'error',
        confirmButtonColor: '#e9101085'
      });
    }else{
      Swal.fire({
        title: 'Profile',
        text: 'Unable To Load Profile!',
        icon: 'error',
        confirmButtonColor: '#e9101085'
      });
    } 
  };
  profile_fetch.send(session_authenticated);
}