//Data validation and data sending
var btn = document.getElementById("log_btn");

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
          sessionStorage.setItem("uname", uname.value);
          Swal.fire({
            title: "Success!",
            text: "Login successful " +uname.value+ "!",
            icon: "success",
          });
          window.location.href = "../../index.html";

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
