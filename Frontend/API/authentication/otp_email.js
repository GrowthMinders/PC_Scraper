function OTPmail(){
  var mail = "";
  var count = 0;

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
        mailchekcer.open("POST", "api/check");
        mailchekcer.setRequestHeader("Content-Type", "application/json");
        mailchekcer.onload = function () {
          if(mailchekcer.status == 200) {
 
            //Sending the OTP throgh email
             var logreq = new XMLHttpRequest();
             logreq.open("POST", "api/otp_mail");
             logreq.setRequestHeader("Content-Type", "application/json");
             logreq.onload = function () {
               if (logreq.status == 200) {
                //Verification of the OTP received by the user
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
                            logreq.open("POST", "api/otp");
                            logreq.setRequestHeader("Content-Type", "application/json");
                            logreq.onload = function () {
                              if (logreq.status == 200) {
                                 Swal.fire({
                                   title: "Success!",
                                   text: "Login successful to account " + mail + "!",
                                   icon: "success",
                                   confirmButtonText: "OK" 
                                 }).then((result) => {
                                     if (result.isConfirmed) {
                                        console.log(logreq.responseText);
                                        //window.location.href = "http://localhost/Scraper/index.html";
                                     }else{
                                      console.log(logreq.responseText);
                                        //window.location.href = "http://localhost/Scraper/index.html";
                                     }
                                 });

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
                                       failcount.open("POST", "api/count"); 
                                       failcount.setRequestHeader("Content-Type", "application/json");
                                       failcount.onload = function () {
                                          if (failcount.status == 200) {
                                            count++;
                                            if(count <= 3){
                                              OTPvrifymail();
                                            } else {
                                              // Deactivating the OTP Due to execcess failure
                                              var otpdeactivator = new XMLHttpRequest();
                                              otpdeactivator.open("POST", "api/otp_deactivate");
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
                                       failcount.open("POST", "api/count");
                                       failcount.setRequestHeader("Content-Type", "application/json");
                                       failcount.onload = function () {
                                          if (failcount.status == 200) {
                                            count++;
                                            if(count <= 3){
                                              OTPvrifymail();
                                            } else {
                                              // Deactivating the OTP Due to execcess failure
                                              var otpdeactivator = new XMLHttpRequest();
                                              otpdeactivator.open("POST", "api/otp_deactivate");
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
                            var data = {email: mail, track: "mail", otp: result.value};
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
             var data = {email: mail};
             var jsonData = JSON.stringify(data);
             logreq.send(jsonData);

          }else{
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


  

