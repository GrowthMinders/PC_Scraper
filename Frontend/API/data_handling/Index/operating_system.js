function main_load (){
  var device = document.getElementById("device_name");
  var win_ver = document.getElementById("windows_version");
  var build_ver = document.getElementById("build_version");
  var last_updated = document.getElementById("last_up");

  var provider = document.getElementById("license_pro");
  var activated = document.getElementById("activation");

  // Checking Whether Any Hardware Has Changed Since After Last Boot
  var software_fetch = new XMLHttpRequest();
  software_fetch.open("POST", "api/operating");
  software_fetch.setRequestHeader("Content-Type", "application/json");
  software_fetch.onload = function () {
    if(software_fetch.status == 200){
      var data = JSON.parse(software_fetch.responseText);

      var instance = data[0];
      
      device.innerHTML = `<strong>Device Name: </strong>` + instance.device_name;
      win_ver.innerHTML = `<strong>OS Version: </strong>` + instance.windows_version;
      build_ver.innerHTML = `<strong>OS Built: </strong>` + instance.build_version;
      last_updated.innerHTML = `<strong>Last Updated: </strong>` + instance.last_update;
      provider.innerHTML = `<strong>License Provider: </strong>` + instance.license_info;
      activated.innerHTML = `<strong>Activation Statues: </strong>` + instance.activation;

    }else{
      Swal.fire({
        title: "Ooops!",
        text: "Currently These Service Is Unavailable, PLease Try Again Later",
        icon: "error",
      });
    }
  };
  software_fetch.send();
}
main_load();

