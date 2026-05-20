var roles = "";
var attempt = false;

var role_redirect = "";

if(attempt === false){
  role_redirect = sessionStorage.getItem('user');
  attempt = true;
  roles = role_redirect;
}

function ping_network(){
  var ping = new XMLHttpRequest();
  ping.open("POST", "api/ping");
  ping.setRequestHeader("Content-Type", "application/json");
    
  ping.onload = function () {
    if(ping.status == 200) {
      var data = JSON.parse(ping.responseText);
      
      var domains_list = data.domains.join(", ");
      
      document.getElementById("domains").innerHTML = `<strong>We tested the network for you using the below websites and tools;</strong>
                                                       <ul type='disk'>
                                                         <li>${data.domains[0]}</li>
                                                         <li>${data.domains[1]}</li>
                                                         <li>${data.domains[2]}</li>
                                                         <li>${data.domains[3]}</li>
                                                         <li>${data.domains[4]}</li>
                                                       </ul> 
                                                       `;

                                                      
      //Unhiding Table
      document.getElementById("metric_table").style.display = "block"; 
      document.getElementById("brand-logo1").style.display = "block";                                                

      //Setting The Table Headings
      document.getElementById("head").innerText = `Network Metrics`;  
      document.getElementById("head1").innerText = `Expected In SL`; 
      document.getElementById("head2").innerText = `Your Results`;  
      document.getElementById("head3").innerText = `Status`;

      //Setting The Metric Names                                                 
      document.getElementById("metric1").innerText = `Average Delay`;                                                 
      document.getElementById("metric2").innerText = `Average Latency`;
      document.getElementById("metric3").innerText = `Average Packet Loss`;
      document.getElementById("metric4").innerText = `Average Jitter`;

      //Setting Expected Values In Sri Lanka
      document.getElementById("sl_delay").innerText = `29.5 ms`;                                                 
      document.getElementById("sl_latency").innerText = `29.5 ms`;
      document.getElementById("sl_pkt_loss").innerText = `4%`;
      document.getElementById("sl_jitter").innerText = `0.78 ms`;

      //User Network Test Results
      document.getElementById("user_delay").innerText = `${data.delay} ms`;                                                 
      document.getElementById("user_latency").innerText = `${data.latency} ms`;
      document.getElementById("user_pkt_loss").innerText = `${data.packet_loss} %`;
      document.getElementById("user_jitter").innerText = `${data.jitter} ms`;

      //Tracking The Status
      var good = 0;
      var bad = 0;
      var final_result = "";
      var msg_color = "";

      //Setting Statuses
      if(data.delay > 29.5){
        document.getElementById("status1").innerHTML = `<p><i class="fa-solid fa-circle-xmark text-danger"></i> Bad</p>`;
        bad++;
      }else{
        document.getElementById("status1").innerHTML = `<p><i class="fa-solid fa-circle-check text-success"></i> Good</p>`;
        good++;
      }

      if(data.latency > 29.5){
        document.getElementById("status2").innerHTML = `<p><i class="fa-solid fa-circle-xmark text-danger"></i> Bad</p>`;
        bad++;
      }else{
        document.getElementById("status2").innerHTML = `<p><i class="fa-solid fa-circle-check text-success"></i> Good</p>`;
        good++;
      }

      if(data.packet_loss <= 4){
        document.getElementById("status3").innerHTML = `<p><i class="fa-solid fa-circle-check text-success"></i> Good</p>`;
        good++;
      }else{
        document.getElementById("status3").innerHTML = `<p><i class="fa-solid fa-circle-xmark text-danger"></i> Bad</p>`;
        bad++;
      }

      if(data.jitter > 0.78){
        document.getElementById("status4").innerHTML = `<p><i class="fa-solid fa-circle-xmark text-danger"></i> Bad</p>`;
        bad++;
      }else{
        document.getElementById("status4").innerHTML = `<p><i class="fa-solid fa-circle-check text-success"></i> Good</p>`;
        good++;
      }



      //Setting The Final Network State
      if(good > bad){
        final_result = "Good";
        msg_color = "green";
      }else if(bad > good){
        final_result = "Bad";
        msg_color = "red";
      }else{
        final_result = "Capable";
        msg_color = "yellow";
      }

      dyna_recommend();

    if((data.delay != 0) && (data.latency != 0) && (data.jitter != 0)){      
      if(data.role === "stream"){
        document.getElementById("final_out").innerHTML = `Network Quality For Streaming: <strong style="color: ${msg_color};">${final_result}</strong>`;
      }else if(data.role === "dev"){
        document.getElementById("final_out").innerHTML = `Network Quality For Developing: <strong style="color: ${msg_color};">${final_result}</strong>`;
      }else if(data.role === "test"){
        document.getElementById("final_out").innerHTML = `Network Quality For Testing: <strong style="color: ${msg_color};">${final_result}</strong>`;
      }else{
        document.getElementById("final_out").innerHTML = `Network Quality For Normal Use: <strong style="color: ${msg_color};">${final_result}</strong>`;
      }
    }else{
      document.getElementById("final_out").innerHTML = `<strong>Internet Connection Lost, Great Things Are Happening Out Explore Now</strong>`;
    }  
      

    }else{
      Swal.fire({
        title: "Oops",
        text: "Currently Our Pinger Service Is Unavailable",
        icon: "error",
        confirmButtonColor: "#e9101085",
      });
    } 
  };
  var datacount = {action: roles};
  var jsonDatacount = JSON.stringify(datacount);
  ping.send(jsonDatacount);

}

setTimeout(function() {
  setInterval(ping_network, 10000);
}, 10000);


