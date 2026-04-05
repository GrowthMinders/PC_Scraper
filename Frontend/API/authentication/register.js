var btn = document.getElementById("reg_btn");

var fname = document.getElementById("fname");
var lname = document.getElementById("lname");
var email = document.getElementById("email");       
var uname = document.getElementById("uname");            
var pass = document.getElementById("pass");
var cpass = document.getElementById("cpass");

const regexnames = /^[A-Za-z\s]{3,50}$/;
const regexuname = /^[A-Za-z0-9_-]{3,50}$/;
const regexmail = /^[A-Za-z\d]{4,40}(@)(outlook\.com|yahoo\.com|gmail\.com)$/;
const regexpass = /^[A-Za-z\d!~`#$%^&*-_+=<>,.|@]{8,30}$/;

btn.addEventListener("click", function(){
  if(fname.value === ""){
        Swal.fire({
          title: "Ooops!",
          text: "Please enter first name",
          icon: "error",
        });
  }else if(lname.value === ""){
        Swal.fire({
          title: "Ooops!",
          text: "Please enter first last name",
          icon: "error",
        });
  }else if(email.value === ""){
        Swal.fire({
          title: "Ooops!",
          text: "Please enter your email",
          icon: "error",
        });
  }else if(pass.value === ""){
        Swal.fire({
          title: "Ooops!",
          text: "Please create a password",
          icon: "error",
        });
  }else if(uname.value === ""){
        Swal.fire({
          title: "Ooops!",
          text: "Please create a username",
          icon: "error",
        });
  }else if(cpass.value === ""){
        Swal.fire({
          title: "Ooops!",
          text: "Please confirm the created password",
          icon: "error",
        });
  }else if(pass.value != cpass.value){
        Swal.fire({
          title: "Ooops!",
          text: "Passwords do not match",
          icon: "error",
        });
  }

  else if(!regexnames.test(fname.value)){
        Swal.fire({
          title: "Ooops!",
          text: "Invalid first name(Max 50 Characters)",
          icon: "error",
        });
  }else if(!regexmail.test(email.value)){
        Swal.fire({ 
          title: "Ooops!",
          text: "Only Gmail,Outlook,Yahoo mails are only allowed",
          icon: "error",
        });
  }else if(!regexpass.test(pass.value)){
        Swal.fire({
          title: "Ooops!",
          text: "Password too weak",
          icon: "error",
        });
  }else if(!regexnames.test(lname.value)){
        Swal.fire({
          title: "Ooops!",
          text: "Invalid last name(Max 50 Characters)",
          icon: "error",
        });
  }else if(!regexuname.test(uname.value)){
        Swal.fire({
          title: "Ooops!",
          text: "Invalid username(Max 50 Characters[-, _, 0-9, A-Z, a-z allowed])",
          icon: "error",
        });
  }else{  
      var request = new XMLHttpRequest();
       request.open("POST" , "api/register");
       request.onload = function(){
         if(request.status === 200){
            Swal.fire({
             title: "Success!",
             text: "Registration successful " +uname.value+ "!",
             icon: "success",
            });
            lname.value = "";
            fname.value = "";
            email.value = "";
            pass.value = "";
            cpass.value = "";
            uname.value = ""; 
         }else if(request.status === 500){
            Swal.fire({
             title: "Ooops!",
             text: "Plaese check your middleware once again",
             icon: "error",
            });
         }else{
            Swal.fire({
             title: "Ooops!",
             text: "Plaese try again later",
             icon: "error",
            });
         }
       };
       var params = {fname:fname.value, email:email.value, pass:pass.value, lname:lname.value, uname:uname.value};
       var jsonparams = JSON.stringify(params);
       request.send(jsonparams);
   
  }
});
