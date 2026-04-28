function main_load (){
  var latency = document.getElementById("latency");
  var jitter = document.getElementById("jitter");
  var packet_loss = document.getElementById("loss");
  var IP = document.getElementById("ip");
  var subnetmask = document.getElementById("mask");
  var gateway = document.getElementById("gate");
  var provider = document.getElementById("provide");
  var mac = document.getElementById("mac");
  var mtu = document.getElementById("mtu");

  var img_isp = document.getElementById("isp_logo");

  // Checking Fro Network Functionality Time By Time
  var network_fetch = new XMLHttpRequest();
  network_fetch.open("POST", "api/networker");
  network_fetch.setRequestHeader("Content-Type", "application/json");
  network_fetch.onload = function () {
    if(network_fetch.status == 200){
      var data = JSON.parse(network_fetch.responseText);

      var instance = data[0];
      
      provider.innerHTML = `<strong>ISP(Internet Service Provider) : </strong>` + instance.isp;
      mtu.innerHTML = `<strong>MTU(Maximum Transmission Unit) : </strong>` + instance.mtu;
      mac.innerHTML = `<strong>MAC Address : </strong>` + instance.mac; 
      gateway.innerHTML = `<strong>Default Gateway : </strong>` + instance.gateway;
      subnetmask.innerHTML = `<strong>Subnet Mask : </strong>` + instance.subnet;
      IP.innerHTML = `<strong>IP Address : </strong>` + instance.ip;

      if(instance.isp === "Dialog Axiata PLC."){
        img_isp.src = "http://localhost/Scraper/Frontend/ASSETS/ISP/Dialog.png"; 
      }else if(instance.isp === "Sri Lanka Telecom Internet"){
        img_isp.src = "http://localhost/Scraper/Frontend/ASSETS/ISP/Telecom.png";   
      }else if(instance.isp === "Mobitel Pvt Ltd"){
        img_isp.src = "http://localhost/Scraper/Frontend/ASSETS/ISP/Mobitel.webp";     
      }else if(instance.isp === "BHARTI Airtel Ltd."){
        img_isp.src = "http://localhost/Scraper/Frontend/ASSETS/ISP/Airtel.png";
      }else if(instance.isp === "234, Galle Road, Colombo 4"){
        img_isp.src = "http://localhost/Scraper/Frontend/ASSETS/ISP/Hutch.png";
        provider.innerHTML = `<strong>ISP(Internet Service Provider) : </strong>` + "Hutchison Telecommunications Lanka (Private) Limited";
      }else{
        img_isp.src = "http://localhost/Scraper/Frontend/ASSETS/ISP/StarLink.png";
      }


    }else{
      Swal.fire({
        title: "Ooops!",
        text: "Currently These Service Is Unavailable, PLease Try Again Later",
        icon: "error",
      });
    }
  };
  network_fetch.send();
}
main_load();

