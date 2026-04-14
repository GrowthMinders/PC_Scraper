function main_load (){
  var cpu = document.getElementById("cpu_name");
  var in_gpu = document.getElementById("internal_gpu");
  var ext_gpu = document.getElementById("external_gpu");
  var ram = document.getElementById("ram");

  // Checking Whether Any Hardware Has Changed Since After Last Boot
  var hardware_fetch = new XMLHttpRequest();
  hardware_fetch.open("POST", "api/networker");
  hardware_fetch.setRequestHeader("Content-Type", "application/json");
  hardware_fetch.onload = function () {
    if(hardware_fetch.status == 200){
      var data = JSON.parse(hardware_fetch.responseText);
      
      cpu.innerHTML = `<strong>CPU: </strong>` + data[0];
      ram.innerHTML = `<strong>RAM: </strong>` + data[3];
      ext_gpu.innerHTML = `<strong>External GPU: </strong>` + data[1];
      in_gpu.innerHTML = `<strong>Internal GPU: </strong>` + data[2];


    }else{
      Swal.fire({
        title: "Ooops!",
        text: "Currently These Service Is Unavailable, PLease Try Again Later",
        icon: "error",
      });
    }
  };
  hardware_fetch.send();
}
main_load();

