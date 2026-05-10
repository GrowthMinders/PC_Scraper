function OTPwhat(){
  var tel_no = "";
  var count = 0;
  var instance = "";

  var data;

  var otp_check = "";
  var otp_wha = "";
  var otp = "";
  var otp_count = "";
  var otp_deactivate = "";
   
  if(origins === "http://localhost/Scraper/Frontend/HTML/login.html"){
    instance = "login";

    //API Paths Setting
    otp_check = "api/check";
    otp_wha = "api/otp_whatsapp";
    otp = "api/otp";
    otp_count = "api/count";
    otp_deactivate = "api/otp_deactivate";
  }else if(origins === "http://localhost/Scraper/index.html1"){
    instance = "change";

    //API Paths Setting
    otp_check = "api/check_alert";
    otp_wha = "api/otp_whatsapp_alert";
    otp = "api/otp_alert";
    otp_count = "api/count_alert";
    otp_deactivate = "api/otp_deactivate_alert";
  }else{
    instance = "edit";

    //API Paths Setting
    otp_check = "api/check_alert";
    otp_wha = "api/otp_whatsapp_alert";
    otp = "api/otp_alert";
    otp_count = "api/count_alert";
    otp_deactivate = "api/otp_deactivate_alert";
  }

  function sms_no_fetcher(){ 
    //Checking Contact Number before OTP sending
    Swal.fire({
      title: 'Please enter your contact number',
      input: 'text',
      inputLabel: 'Contact Number',
      inputPlaceholder: 'Type your contact number here...',
      showCancelButton: true
    }).then((result) => {
      if(result.value){
        tel_no = result.value;
        
        //Contact number similarity testing
        var mailchekcer = new XMLHttpRequest();
        mailchekcer.open("POST", otp_check);
        mailchekcer.setRequestHeader("Content-Type", "application/json");
        mailchekcer.onload = function () {
          if(mailchekcer.status == 200) {
               Swal.fire({
                 title: 'Sending OTP...',
                 html: `Sending OTP to <b>${tel_no}</b><br>Please wait...`,
                 allowOutsideClick: false,
                 showConfirmButton: false,
                 didOpen: () => {
                   Swal.showLoading();
                 }
               });

            //Sending the OTP throgh Contact Number
             var logreq = new XMLHttpRequest();
             logreq.open("POST", otp_wha);
             logreq.setRequestHeader("Content-Type", "application/json");
             logreq.onload = function () {
               if (logreq.status == 200) {
                //Verification of the OTP received by the user
                 Swal.close(); 
                 Swal.fire({
                   title: "Success!",
                   text: "OTP Sent successfully to " + tel_no + "!",
                   icon: "success",
                   confirmButtonText: "OK" 
                 }).then((result) => {
                     if(result.isConfirmed){
                      function OTPvrifysms_no(){
                       //Getting the OTP from user to be tested
                       Swal.fire({
                        title: 'Please check your SMS viewer and enter the OTP received',
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
                                      text: "Login successful to account " + tel_no + "!",
                                      icon: "success",
                                      confirmButtonText: "OK" 
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        //JWT Token
                                        var session = JSON.parse(logreq.responseText); 
                                        sessionStorage.setItem("loged", session.token);
                                        window.location.href = "http://localhost/Scraper/index.html";
                                      }else{
                                        //JWT Token
                                        var session = JSON.parse(logreq.responseText); 
                                        sessionStorage.setItem("loged", session.token);
                                        window.location.href = "http://localhost/Scraper/index.html";
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

                                 }else{

                                     Swal.fire({
                                      title: "Success!",
                                      text: "OTP Validated for " + tel_no + "!",
                                      icon: "success",
                                      confirmButtonText: "OK" 
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                       function update_push(){
                                         var target_update = tracker;

                                         if(target_update === "email"){
                                           var params = {id:ids, email:email, trackers:target_update};
                                         }else{
                                           var params = {id:ids, tel:tel, trackers:target_update};
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
                                              OTPvrifysms_no();
                                            } else {
                                              // Deactivating the OTP Due to execcess failure
                                              var otpdeactivator = new XMLHttpRequest();
                                              otpdeactivator.open("POST", otp_deactivate);
                                              otpdeactivator.setRequestHeader("Content-Type", "application/json");
                                              otpdeactivator.onload = function () {
                                                if (otpdeactivator.status == 200) {
                                                  OTPwhat();
                                                }
                                              };
                                              var datacount = {email: mail, track: "what"};
                                              var jsonDatacount = JSON.stringify(datacount);
                                              otpdeactivator.send(jsonDatacount);

                                            }
                                          }
                                       };
                                       var datacount = {tel: tel_no, track: "what"};
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
                                              OTPvrifysms_no();
                                            } else {
                                              // Deactivating the OTP Due to execcess failure
                                              var otpdeactivator = new XMLHttpRequest();
                                              otpdeactivator.open("POST", otp_deactivate);
                                              otpdeactivator.setRequestHeader("Content-Type", "application/json");
                                              otpdeactivator.onload = function () {
                                                if (otpdeactivator.status == 200) {
                                                  OTPwhat();
                                                }
                                              };
                                              var datacount = {email: mail, track: "what"};
                                              var jsonDatacount = JSON.stringify(datacount);
                                              otpdeactivator.send(jsonDatacount);
                                            }
                                          }
                                       };
                                       var datacount = {tel: tel_no, track: "what"};
                                       var jsonDatacount = JSON.stringify(datacount);
                                       failcount.send(jsonDatacount);
                                     }
                                 });
                                
                              }
                            };
                            var data = {tel: tel_no, track: "what", otp: result.value, purpose: instance};
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
                    OTPvrifysms_no();

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
                  text: "Failed to send OTP to " + tel_no + "!" + " (Error: " + logreq.responseText + ")",
                  icon: "error",
                });
               }
             };

             if(instance === "login"){
               data = {tel: tel_no};
             }else{
               data = {tel: tel_no, trackers: tracker};
             }

             var jsonData = JSON.stringify(data);
             logreq.send(jsonData);

          }else{
            Swal.fire({
              title: "Error!",
              text: "Contact Number did not match our records. Please enter a valid Contact Number.",
              icon: "error",
            });
          }
       };
       var data1 = {tel: tel_no};
       var jsonData1 = JSON.stringify(data1);
       mailchekcer.send(jsonData1);

      }else{
         Swal.fire({
            title: "Ooops!",
            text: "Contact is required to send OTP",
            icon: "error",
            confirmButtonText: "OK" 
         }).then((result) => {
            if (result.isConfirmed) {
              sms_no_fetcher();
            }else{
              sms_no_fetcher();
            }
         });
      }
    });
  }  
  sms_no_fetcher();
}


  



