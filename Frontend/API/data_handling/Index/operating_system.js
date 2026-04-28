function main_load (){
  var device = document.getElementById("device_name");
  var win_ver = document.getElementById("windows_version");
  var build_ver = document.getElementById("build_version");
  var last_updated = document.getElementById("last_up");
  var provider = document.getElementById("license_pro");
  var activated = document.getElementById("activation");

  var win = document.getElementById("win_logo");

  // Checking Whether Any Software Based Changes Since After Last Boot
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

      var version = instance.windows_version;

      if(version.toLowerCase().includes("xp")){
        win.src = "http://localhost/Scraper/Frontend/ASSETS/OS-Logo/Windows XP.png";
      }else if(version.toLowerCase().includes("vista")){
        win.src = "http://localhost/Scraper/Frontend/ASSETS/OS-Logo/Windows Vista.png";
      }else{
        const version_numbers = instance.windows_version.match(/\d+/g).join('');
          if(version_numbers === "7"){
            win.src = "http://localhost/Scraper/Frontend/ASSETS/OS-Logo/Windows 7.png";
          }else if(version_numbers === "8"){
            win.src = "http://localhost/Scraper/Frontend/ASSETS/OS-Logo/Windows 8.png";
          }else if(version_numbers === "8.1"){
            win.src = "http://localhost/Scraper/Frontend/ASSETS/OS-Logo/Windows 8.1.png";
          }else if(version_numbers === "10"){
            win.src = "http://localhost/Scraper/Frontend/ASSETS/OS-Logo/Windows 10.png";
          }else{
            win.src = "http://localhost/Scraper/Frontend/ASSETS/OS-Logo/Windows 11.png";
          }
      }
  
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

