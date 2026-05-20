var instance = "";
function OTPmail(){
  var mail = "";
  var count = 0;
  var instance = "";
  var action_track = "";

  var otp_check = "";
  var otp_mail = "";
  var otp = "";
  var otp_count = "";
  var otp_deactivate = "";

  var params;
  var data;
   
  if(origins === "http://localhost/Scraper/Frontend/HTML/login.html"){
    instance = "login";

    //API Paths Setting
    otp_check = "api/check";
    otp_mail = "api/otp_mail";
    otp = "api/otp";
    otp_count = "api/count";
    otp_deactivate = "api/otp_deactivate";
  }else if(origins === "http://localhost/Scraper/index.html1"){
    instance = "change";

    //API Paths Setting
    otp_check = "api/check_alert";
    otp_mail = "api/otp_mail_alert";
    otp = "api/otp_alert";
    otp_count = "api/count_alert";
    otp_deactivate = "api/otp_deactivate_alert";
  }else{ 
    instance = "edit";

    //API Paths Setting
    otp_check = "api/check_alert";
    otp_mail = "api/otp_mail_alert";
    otp = "api/otp_alert";
    otp_count = "api/count_alert";
    otp_deactivate = "api/otp_deactivate_alert";
  }

  if(origins === "http://localhost/Scraper/index.html2"){
    instance = "delete";
    action_track = "delete";
  }



  function email_fetcher(){
    //Checking email address before OTP sending
    Swal.fire({
      title: 'Please enter your email address',
      input: 'text',
      inputLabel: 'Email',
      inputPlaceholder: 'Type your email here...',
      showCancelButton: true
    }).then((result) => {
      if(result.value){
        mail = result.value;
        
        //Email similarity testing
        var mailchekcer = new XMLHttpRequest();
        mailchekcer.open("POST", otp_check);
        mailchekcer.setRequestHeader("Content-Type", "application/json");
        mailchekcer.onload = function () {
          if(mailchekcer.status == 200) {
              Swal.fire({
               title: 'Sending OTP...',
               html: `Sending OTP to <b>${mail}</b><br>Please wait...`,
               allowOutsideClick: false,
               showConfirmButton: false,
                didOpen: () => {
                  Swal.showLoading(); 
                }
              }); 
              
            //Sending the OTP throgh email
             var logreq = new XMLHttpRequest();
             logreq.open("POST", otp_mail);
             logreq.setRequestHeader("Content-Type", "application/json");
             logreq.onload = function () {
               if (logreq.status == 200) {
                //Verification of the OTP received by the user
                 Swal.close(); 
                 Swal.fire({
                   title: "Success!",
                   text: "OTP Sent successfully to " + mail + "!",
                   icon: "success",
                   confirmButtonText: "OK" 
                 }).then((result) => {
                     if(result.isConfirmed){
                      function OTPvrifymail(){
                       //Getting the OTP from user to be tested
                       Swal.fire({
                        title: 'Please check your inbox and enter the OTP received',
                        input: 'text',
                        inputLabel: 'OTP',
                        inputPlaceholder: 'Type your OTP here...',
                        showCancelButton: true
                     }).then((result) => {
                        if(result.value){
                          //Now testing the OTP to log the user in 
                            var logreq = new XMLHttpRequest();
                            logreq.open("POST", otp);
                            logreq.setRequestHeader("Content-Type", "application/json");
                            logreq.onload = function () {
                              if (logreq.status == 200) {
                                
                                 if(instance === "login"){

                                    Swal.fire({
                                      title: "Success!",
                                      text: "Login successful to account " + mail + "!",
                                      icon: "success",
                                      confirmButtonText: "OK" 
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        //JWT Token
                                        var session = JSON.parse(logreq.responseText); 
                                        sessionStorage.setItem("loged", session.token);
 
                                        //Redirect To Splash Screen
                                        window.location.href = "http://localhost/Scraper/Frontend/HTML/splash.html";
                                      
                                      }else{
                                        //JWT Token
                                        var session = JSON.parse(logreq.responseText); 
                                        sessionStorage.setItem("loged", session.token);

                                        //Redirect To Splash Screen
                                        window.location.href = "http://localhost/Scraper/Frontend/HTML/splash.html";
                                      }
                                    });

                                 }else if(instance === "change"){  

                                   var password_change = new XMLHttpRequest();
                                   password_change.open("POST", "api/change_password");
                                   password_change.setRequestHeader("Content-Type", "application/json");

                                   password_change.onload = function () {
                                     if (password_change.status == 200) {
                                       Swal.fire({
                                         title: "Done",
                                         text: "Account Password Changed Successfully",
                                         icon: "success",
                                         confirmButtonColor: "#1ad4439c",
                                       });
                                     } else if (password_change.status == 405) {
                                       Swal.fire({
                                         title: "Oops",
                                         text: "Check Your Current Password, Please Try Again",
                                         icon: "error",
                                         confirmButtonColor: "#e9101085",
                                       });
                                     } else {
                                       Swal.fire({
                                         title: "Oops",
                                         text: "Unable Set New Password, Please Try Again",
                                         icon: "error",
                                         confirmButtonColor: "#e9101085",
                                       });
                                     }
                                   };
                                   password_change.send(
                                     JSON.stringify({
                                       now_pass: now_pass,
                                       new_pass: new_pass,
                                       id: ids_chg,
                                     }),
                                   );

                                 }else if(instance === "delete"){
                                  Swal.fire({
                                      title: "Success!",
                                      text: "OTP Validated for " + mail + "!",
                                      icon: "success",
                                      confirmButtonText: "OK" 
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                       function delete_push(){
                                        var profile_delete = new XMLHttpRequest();
                                        profile_delete.open("POST", "api/delete_profile");
                                        profile_delete.setRequestHeader("Content-Type", "application/json");
    
                                        profile_delete.onload = function () {
                                          if(profile_delete.status == 200){
                                            Swal.fire({
                                              title: 'Done',
                                              text: 'Account Successfully Deleted',
                                              icon: 'success',
                                              confirmButtonColor: '#1ad4439c'
                                            }).then((result) => {
                                              window.location.href = "http://localhost/Scraper/Frontend/HTML/login.html";
                                            });
                                          }else{
                                            Swal.fire({
                                              title: 'Oops',
                                              text: 'Unable to delete account at these moment',
                                              icon: 'error',
                                              confirmButtonColor: '#e9101085'
                                            }); 
                                          }  
                                         };
                                         var params = {user: ids};
                                         var jsonparams = JSON.stringify(params);
                                         profile_delete.send(jsonparams);
                                        } 
                                       delete_push();
                                      }else{
                                       delete_push();
                                      }
                                    });

                                 }else{

                                     Swal.fire({
                                      title: "Success!",
                                      text: "OTP Validated for " + mail + "!",
                                      icon: "success",
                                      confirmButtonText: "OK" 
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                       function update_push(){
                                         var target_update = tracker;

                                         if(target_update === "email"){
                                           params = {id:ids, email:email, trackers:target_update};
                                         }else{
                                           params = {id:ids, tel:tel, trackers:target_update};
                                         }

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
                                              window.location.href = "http://localhost/Scraper/index.html";
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
                                         var jsonparams = JSON.stringify(params);
                                         profile_update.send(jsonparams);
                                        } 
                                       update_push();
                                      }else{
                                       update_push();
                                      }
                                    });

                                  }

                              } else {
                                console.log(logreq.responseText);
                                Swal.fire({
                                  title: "Error!",
                                  text: "Invalid OTP",
                                  icon: "error",
                                  confirmButtonText: "OK" 
                                 }).then((result) => {
                                     if (result.isConfirmed) {
                                       //Tracking of failed attempts
                                       var failcount = new XMLHttpRequest();
                                       failcount.open("POST", otp_count); 
                                       failcount.setRequestHeader("Content-Type", "application/json");
                                       failcount.onload = function () {
                                          if (failcount.status == 200) {
                                            count++;
                                            if(count <= 3){
                                              OTPvrifymail();
                                            } else {
                                              // Deactivating the OTP Due to execcess failure
                                              var otpdeactivator = new XMLHttpRequest();
                                              otpdeactivator.open("POST", otp_deactivate);
                                              otpdeactivator.setRequestHeader("Content-Type", "application/json");
                                              otpdeactivator.onload = function () {
                                                if (otpdeactivator.status == 200) {
                                                  OTPmail();
                                                }
                                              };
                                              var datacount = {email: mail, track: "mail"};
                                              var jsonDatacount = JSON.stringify(datacount);
                                              otpdeactivator.send(jsonDatacount);
                                            }
                                          }
                                       };
                                       var datacount = {email: mail, track: "mail"};
                                       var jsonDatacount = JSON.stringify(datacount);
                                       failcount.send(jsonDatacount);
                                     } else {
                                       var failcount = new XMLHttpRequest();
                                       failcount.open("POST", otp_count);
                                       failcount.setRequestHeader("Content-Type", "application/json");
                                       failcount.onload = function () {
                                          if (failcount.status == 200) {
                                            count++;
                                            if(count <= 3){
                                              OTPvrifymail();
                                            } else {
                                              // Deactivating the OTP Due to execcess failure
                                              var otpdeactivator = new XMLHttpRequest();
                                              otpdeactivator.open("POST", otp_deactivate);
                                              otpdeactivator.setRequestHeader("Content-Type", "application/json");
                                              otpdeactivator.onload = function () {
                                                if (otpdeactivator.status == 200) {
                                                  OTPmail();
                                                }
                                              };
                                              var datacount = {email: mail, track: "mail"};
                                              var jsonDatacount = JSON.stringify(datacount);
                                              otpdeactivator.send(jsonDatacount);
                                            }
                                          }
                                       };
                                       var datacount = {email: mail, track: "mail"};
                                       var jsonDatacount = JSON.stringify(datacount);
                                       failcount.send(jsonDatacount);
                                     }
                                 });
                                
                              }
                            };
                            var data = {email: mail, track: "mail", otp: result.value, purpose: instance, user: role};
                            var jsonData = JSON.stringify(data);
                            logreq.send(jsonData);
                          
                          

                        }else{
                          Swal.fire({
                            title: "Error!",
                            text: "Invalid OTP",
                            icon: "error",
                          });
                        }  
                     });   
                    } 
                    OTPvrifymail();

               }else{
                 Swal.fire({
                  title: "Oops!",
                  text: "The OTP was not entered.",
                  icon: "error",
                 });
               }
                 });


               }else{
                Swal.fire({
                  title: "Error!",
                  text: "Failed to send OTP to " + mail + "!" + " (Error: " + logreq.responseText + ")",
                  icon: "error",
                });
               }
             };

             if(action_track != ""){
               var data = {email: mail, tactic: action_track};
             }else if(action_track == "" && instance != "login"){
               var data = {email: mail, trackers: tracker};
             }else{
               var data = {email: mail};
             }

             var jsonData = JSON.stringify(data);
             logreq.send(jsonData);

          }else{
            Swal.close(); 
            Swal.fire({
              title: "Error!",
              text: "Email address did not match our records. Please enter a valid email address.",
              icon: "error",
            });
          }
       };
       var data1 = {email: mail};
       var jsonData1 = JSON.stringify(data1);
       mailchekcer.send(jsonData1);

      }else{
         Swal.fire({
            title: "Ooops!",
            text: "Email is required to send OTP",
            icon: "error",
            confirmButtonText: "OK" 
         }).then((result) => {
            if (result.isConfirmed) {
              email_fetcher();
            }else{
              email_fetcher();
            }
         });
      }
    });
  }  
  email_fetcher();
}


  

