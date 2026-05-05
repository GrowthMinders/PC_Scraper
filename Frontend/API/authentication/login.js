//Data validation and data sending
var btn = document.getElementById("log_btn");
var forgot = document.getElementById("fpass");

var uname = document.getElementById("uname");
var pass = document.getElementById("pass");

btn.addEventListener("click", function () {
  if (uname.value === "") {
    Swal.fire({
      title: "Ooops!",
      text: "Please enter your username",
      icon: "error",
    });
  } else if (pass.value === "") {
    Swal.fire({
      title: "Ooops!",
      text: "Please enter your password",
      icon: "error",
    });
  } else {

    var logreq = new XMLHttpRequest();
    logreq.open("POST", "api/login");
    logreq.onload = function () {
      if (logreq.status == 200) {
        
      Swal.fire({
        title: 'Select OTP Mode',
        input: 'select',
        inputOptions: {
            sms: 'SMS',
            what: 'Whatsapp',
            email: 'Email'
        },
        inputPlaceholder: 'Select preferred OTP mode'
      }).then((result) => {
          const otp_mode = result.value;
    
          if(otp_mode === "sms"){
            OTPsms(); 
          }else if(otp_mode === "what"){
            OTPwhat();
          }else{
            OTPmail();
          }
     });
      
      } else if(logreq.status == 401){
        Swal.fire({
          title: "Ooops!",
          text: "Account not found",
          icon: "error",
        });
      }else {
        Swal.fire({
          title: "Ooops!",
          text: "Invalid Credentials",
          icon: "error",
        });
      }
    };
    var data = {uname: uname.value, pass: pass.value};
    var jsonData = JSON.stringify(data);
    logreq.send(jsonData);
  }
});


//Forgott Password Code Block
forgot.addEventListener("click", function () {
  var email = "";

  Swal.fire({
    title: 'Please eneter your email address, which is associated with your account',
    input: 'text',
    inputLabel: 'Enter your email address',
    inputPlaceholder: 'Type your Email here...',
    showCancelButton: true
  }).then((result) => {
      if(result.value){
        email = result.value;

          // Email Validation
          var pass_reset = new XMLHttpRequest();
          pass_reset.open("POST", "api/password_reset");
          pass_reset.setRequestHeader("Content-Type", "application/json");
          pass_reset.onload = function () {
            if (pass_reset.status == 200) {

              // Password Reset Link Sending Request
              var pass_reset_link = new XMLHttpRequest();
              pass_reset_link.open("POST", "api/password_reset_send");
              pass_reset_link.setRequestHeader("Content-Type", "application/json");
              pass_reset_link.onload = function () {
                if (pass_reset_link.status == 200) {
                  Swal.fire({
                    title: "Success!",
                    text: "Password Reset  Link Sent to " + email + "!",
                    icon: "success",
                  });             
                }else{
                  Swal.fire({
                    title: "Oops!",
                    text: "Failed to send password reset link to " + email + "!",
                    icon: "error",
                  }); 
                }
              };
              var datacount = {email: email};
              var jsonDatacount = JSON.stringify(datacount);
              pass_reset_link.send(jsonDatacount);   

            }else{
               Swal.fire({
                title: "Oops!",
                text: "Account was not found " + email + "!",
                icon: "error",
               }); 
            }
          };
          var datacount = {email: email, track: "pass_link"};
          var jsonDatacount = JSON.stringify(datacount);
          pass_reset.send(jsonDatacount);

      }else{
        Swal.fire({
          title: "Error!",
          text: "Invalid Email Address",
          icon: "error",
        });
    }   
  });    

});