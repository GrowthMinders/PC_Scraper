function change_password(){
   var session_authenticated = sessionStorage.getItem('loged');

   Swal.fire({
        title: "Change Account Password",
        html: `
         <div style="text-align: center; padding: 10px;">

          <div style="margin-bottom: 20px;">
            <img src="http://localhost/Scraper/Frontend/ASSETS/DP.avif" 
               style="border-radius: 50%; width: 120px; height: 120px; object-fit: cover;" 
               alt="Avatar">
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
        
            <input type="password" id="now_pass" class="swal2-input" style="width: 350px; margin: 0;" placeholder="Current Password">
        
            <input type="password" id="new_pass" class="swal2-input" style="width: 350px; margin: 0;" placeholder="New Password">

            <input type="password" id="confirm_new_pass" class="swal2-input" style="width: 350px; margin: 0;" placeholder="Confirm New Password">

          </div>
         </div>`,
    
        didOpen: () => {
          
          const edits = document.querySelectorAll(".editor");
          const btn = Swal.getConfirmButton();


          btn.addEventListener("click", () => {
            const now_pass = document.getElementById("now_pass").value;
            const new_pass = document.getElementById("new_pass").value;
            const cnew_pass = document.getElementById("confirm_new_pass").value;

            const regexpass = /^[A-Za-z\d!~`#$%^&*-_+=<>,.|@]{8,30}$/;

            if (now_pass === "" || new_pass === "" || cnew_pass === "") {
              Swal.showValidationMessage("Please fill in all fields.");
              return false;

            }else if (!regexpass.test(new_pass)) {
              Swal.showValidationMessage("New password must be 8-30 characters long and contain only letters, numbers, and special characters.");
              return false;

            }else if (new_pass !== cnew_pass) {
              Swal.showValidationMessage("New passwords do not match.");
              return false; 

            }else{

              var profile_id_grab = new XMLHttpRequest();
              profile_id_grab.open("POST", "api/change_password");
              profile_id_grab.setRequestHeader("Content-Type", "application/json");
    
              profile_id_grab.onload = function () {
                if(profile_id_grab.status == 200) {
                  var ids = JSON.parse(profile_id_grab.responseText);

                  var password_change = new XMLHttpRequest();
                  password_change.open("POST", "api/change_password");
                  password_change.setRequestHeader("Content-Type", "application/json");

                  password_change.onload = function () {
                    if(password_change.status == 200){
                      Swal.fire({
                        title: 'Done',
                        text: 'Account Password Changed Successfully',
                        icon: 'success',
                        confirmButtonColor: '#1ad4439c'
                      });
                    }else if(password_change.status == 405){
                      Swal.fire({
                        title: 'Oops',
                        text: 'Check Your Current Password, Please Try Again',
                        icon: 'error',
                        confirmButtonColor: '#e9101085'
                      });
                    }else{
                      Swal.fire({
                        title: 'Oops',
                        text: 'Unable Set New Password, Please Try Again',
                        icon: 'error',
                        confirmButtonColor: '#e9101085'
                      });
                   }  
                  };
                  password_change.send(JSON.stringify({
                    "now_pass": now_pass,
                    "new_pass": new_pass,
                    "id": ids
                  }));

                } else {
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
          });
        }    
      }); 

} 