//Gathering OS Related Data
var device_name = document.getElementById("device_name").value;
var windows_version = document.getElementById("windows_version").value;
var build_version = document.getElementById("build_version").value;
var last_up = document.getElementById("last_up").value;
var license_pro = document.getElementById("license_pro").value;
var activation = document.getElementById("activation").value;

//Gathering Hardware Related Data
var cpu_name = document.getElementById("cpu_name").value;
var ram = document.getElementById("ram").value;
var external_gpu = document.getElementById("external_gpu").value;
var internal_gpu = document.getElementById("internal_gpu").value;
var storage = document.getElementById("drive").value;

var cause = "";

var first_time_detect = new XMLHttpRequest();
first_time_detect.open("POST", "api/db_tally");
first_time_detect.setRequestHeader("Content-Type", "application/json");
    
first_time_detect.onload = function () {
  if(first_time_detect.status == 200) {
    var data = JSON.parse(first_time_detect.responseText);
    var instance = data[0];
    var user_id = instance.id;

    cause = "grab_data";
    
    if(instance.ip != "0" && instance.time != "0"){
      
      var change_notifier = new XMLHttpRequest();
      change_notifier.open("POST", "api/db_tally");
      change_notifier.setRequestHeader("Content-Type", "application/json");
    
      change_notifier.onload = function () {
        if(change_notifier.status == 200) {
          Swal.fire({
            title: "Details Found",
            text: "All records were compared",
            icon: "success",
            confirmButtonColor: "#10e92280",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.close();
            } else {
              Swal.close();
            }
          });

        } else {
          Swal.fire({
            title: "Hardware Changes Detecting",
            text: "Currently We Are Unable To Fetch Hardware Chnages!",
            icon: "error",
            confirmButtonColor: "#e9101085",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.close();
            } else {
              Swal.close();
            }
         });
        } 
      }    
      };
      var datacount = {session: user_id, reason: cause, soft1: device_name, soft2: windows_version, soft3: build_version, soft4: last_up, soft5: license_pro, soft6: activation, 
                       hard1: cpu_name, hard2: ram, hard3: external_gpu, hard4: internal_gpu, hard5: storage};
      var jsonDatacount = JSON.stringify(datacount);
      change_notifier.send(jsonDatacount);

  } else {
    Swal.fire({
      title: "Profile Verification",
      text: "Profile Not Found",
      icon: "error",
      confirmButtonColor: "#e9101085",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
      } else {
        Swal.close();
      }
    });
  }  
};
first_time_detect.send(session_authenticated);



