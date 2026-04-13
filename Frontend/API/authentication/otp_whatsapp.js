function OTPwhat(){
  var tel_no = "";
  var count = 0;

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
        mailchekcer.open("POST", "api/check");
        mailchekcer.setRequestHeader("Content-Type", "application/json");
        mailchekcer.onload = function () {
          if(mailchekcer.status == 200) {
 
            //Sending the OTP throgh Contact Number
             var logreq = new XMLHttpRequest();
             logreq.open("POST", "api/otp_whatsapp");
             logreq.setRequestHeader("Content-Type", "application/json");
             logreq.onload = function () {
               if (logreq.status == 200) {
                //Verification of the OTP received by the user
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
                            logreq.open("POST", "api/otp");
                            logreq.setRequestHeader("Content-Type", "application/json");
                            logreq.onload = function () {
                              if (logreq.status == 200) {
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
                                       failcount.open("POST", "api/count"); 
                                       failcount.setRequestHeader("Content-Type", "application/json");
                                       failcount.onload = function () {
                                          if (failcount.status == 200) {
                                            count++;
                                            if(count <= 3){
                                              OTPvrifysms_no();
                                            } else {
                                              // Deactivating the OTP Due to execcess failure
                                              var otpdeactivator = new XMLHttpRequest();
                                              otpdeactivator.open("POST", "api/otp_deactivate");
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
                                       failcount.open("POST", "api/count");
                                       failcount.setRequestHeader("Content-Type", "application/json");
                                       failcount.onload = function () {
                                          if (failcount.status == 200) {
                                            count++;
                                            if(count <= 3){
                                              OTPvrifysms_no();
                                            } else {
                                              // Deactivating the OTP Due to execcess failure
                                              var otpdeactivator = new XMLHttpRequest();
                                              otpdeactivator.open("POST", "api/otp_deactivate");
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
                            var data = {tel: tel_no, track: "what", otp: result.value};
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
             var data = {tel: tel_no};
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


  



