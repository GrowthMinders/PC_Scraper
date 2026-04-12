var reset = document.getElementById("reset_btn");

//Resetting the Password
reset.addEventListener("click", function () {
   var new_pass = document.getElementById("pass").value;
   var new_cpass = document.getElementById("cpass").value;

   const urlParams = new URLSearchParams(window.location.search);

   // Getting the mail and tocket to compare
   const email = urlParams.get('email');
   const ticket = urlParams.get('token');

   const regexpass = /^[A-Za-z\d!~`#$%^&*-_+=<>,.|@]{8,30}$/;

    if(new_pass === "" || new_cpass === ""){
        Swal.fire({
          title: "Error!",
          text: "Please fill all the fields",
          icon: "error",
        });

    }else if(!regexpass.test(new_pass)){
        Swal.fire({
          title: "Ooops!",
          text: "Password too weak",
          icon: "error",
        });

    }else if(new_pass != new_cpass){
        Swal.fire({
          title: "Ooops!",
          text: "Passwords do not match",
          icon: "error",
        });
 
    }else{
      // Setting The Password As Requested By User
      var pass_reset = new XMLHttpRequest();
      pass_reset.open("POST", "api/password_reset");
      pass_reset.setRequestHeader("Content-Type", "application/json");
      pass_reset.onload = function () {
        if (pass_reset.status == 200) {
          Swal.fire({
            title: "Success!",
            text: "Password Reset Success For Account " + email + "!",
            icon: "success",
          });                                
        }else if(pass_reset.status == 401){
          Swal.fire({
            title: "Oops!",
            text: "Password Reset Unsuccessful For Account " + email + ", Link Has Being Expired!",
            icon: "error",
          }); 
        }else{
          Swal.fire({
            title: "Oops!",
            text: "Password Reset Unsuccessful For Account " + email + "!",
            icon: "error",
          }); 
        }
      };
      var datacount = {pass: new_pass, track: "pass_set", ticket: ticket, email : email};
      var jsonDatacount = JSON.stringify(datacount);
      pass_reset.send(jsonDatacount);
    }

});