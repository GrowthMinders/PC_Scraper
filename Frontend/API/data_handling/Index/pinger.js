var role = "";
var attempt = false;


function ping_network(){
  var ping = new XMLHttpRequest();
  ping.open("POST", "api/ping");
  ping.setRequestHeader("Content-Type", "application/json");
    
  ping.onload = function () {
    if(ping.status !== 200) {
      var data = JSON.parse(ping.responseText);
      
      var domainsList = data.tested_domains.join(", ");
      
      document.getElementById("domains").innerHTML = `<strong>Jitter: </strong> ${domainsList}`;
      document.getElementById("delay").innerHTML = `<strong>Jitter: </strong> ${data.average_delay}`;
      document.getElementById("latency").innerHTML = `<strong>Jitter: </strong> ${data.average_latency}`;
      document.getElementById("packet_loss").innerHTML = `<strong>Jitter: </strong> ${data.average_packet_loss}`;
      document.getElementById("jitter").innerHTML = `<strong>Jitter: </strong> ${data.average_jitter}`;
      document.getElementById("throughput").innerHTML = `<strong>Jitter: </strong> ${data.average_throughput}`;

    }else{
      Swal.fire({
        title: "Oops",
        text: "Currently Our Pinger Service Is Unavailable",
        icon: "error",
        confirmButtonColor: "#e9101085",
      });
    } 
  };
  var datacount = {action: role};
  var jsonDatacount = JSON.stringify(datacount);
  ping.send(jsonDatacount);

}


function first_ping(){
 Swal.fire({
   title: 'Select Target Role',
   input: 'select',
   inputOptions: {
     stream: 'Streaming',
     dev: 'Development',
     test: 'Testing',
     normal: 'Basic Use'
   },
   inputPlaceholder: 'Target Playground'
 }).then((result) => {
     role = result.value;
     attempt = true;
 });  
  
}
first_ping();


if(attempt && role != ""){
  ping_network();
}
 

setTimeout(function() {
  setInterval(ping_network, 5000);
}, 10000);


