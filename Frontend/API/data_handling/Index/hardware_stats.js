function main_load (){
  var cpu = document.getElementById("cpu_name");
  var in_gpu = document.getElementById("internal_gpu");
  var ext_gpu = document.getElementById("external_gpu");
  var ram = document.getElementById("ram");

  // Checking Whether Any Hardware Has Changed Since After Last Boot
  var hardware_fetch = new XMLHttpRequest();
  hardware_fetch.open("POST", "api/hard_names");
  hardware_fetch.setRequestHeader("Content-Type", "application/json");
  hardware_fetch.onload = function () {
    if(hardware_fetch.status == 200){
      var data = JSON.parse(hardware_fetch.responseText);
      
      cpu.innerHTML = `<strong>CPU: </strong>` + data.hardware[0];
      ram.innerHTML = `<strong>RAM: </strong>` + data.hardware[3];
      ext_gpu.innerHTML = `<strong>External GPU: </strong>` + data.hardware[1];
      in_gpu.innerHTML = `<strong>Internal GPU: </strong>` + data.hardware[2];

      // Target the existing centered stats container to inherit unified flex styles
      var statsContainer = document.querySelector("#profiler .stats-box");
      
      // Clear out any previously generated dynamic storage entries to prevent data ghosting loops
      var existingDrive = document.getElementById("drive");
      if (existingDrive) {
          existingDrive.remove();
      }

      let drive_no = document.createElement("span");
      drive_no.id = "drive";
      
      // Builds a clean block matching the spacing parameters of other lines
      drive_no.style.display = "inline-block";
      drive_no.style.marginTop = "14px";
      
      data.storage.forEach((drives, index) => {
        if(index == 0){
          drive_no.innerHTML += `<strong>Storage ${index + 1}: </strong>` + drives + `<br>`;
        } else {
          drive_no.innerHTML += `<br><strong>Storage ${index + 1}: </strong>` + drives;
        }
      });

      // Appends inside the centered flex matrix box safely
      if(statsContainer) {
          statsContainer.appendChild(drive_no);
      }

    }else{
      Swal.fire({
        title: "Ooops!",
        text: "Currently These Service Is Unavailable, Please Try Again Later",
        icon: "error",
      });
    }
  };
  hardware_fetch.send();
}
main_load();


