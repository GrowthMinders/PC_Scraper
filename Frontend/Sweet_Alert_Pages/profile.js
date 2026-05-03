function profile(){
  var session_authenticated = sessionStorage.getItem('loged');

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
                  input_memory = prev_input_memory;
                  const tracked = this.getAttribute("target");
                  prev_input_memory = document.getElementById(tracked);
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
                  // Optional: Add logic here to save the data via API (Always get value of [input_memory])

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

/*

      Swal.fire({
        title: 'User Profile',
        html: `
          <div style="text-align: center; padding: 20px;"> 
            <div style="margin-bottom: 20px;">
               <img src="http://localhost/Scraper/Frontend/ASSETS/DP.avif" style="border-radius: 50%; width: 120px; height: 120px;"
                alt="Avatar">
            </div>

            <input type="text" id="uname" class="swal2-input" style="width: 350px;" value="${instance.uname}" readonly>
            <input type="text" id="name" class="swal2-input" style="width: 350px;" value="${instance.fname + " " + instance.lname}" readonly>
            <input type="text" id="email" class="swal2-input" style="width: 350px;" value="${instance.email}">
            <input type="text" id="tel" class="swal2-input" style="width: 350px;" value="${instance.telephone}">

          </div>`
      }); 

*/