var cpu_use = document.getElementById("cpu_use");
var cpu_up = document.getElementById("cpu_up");  
var cpu_core = document.getElementById("cpu_core");
var cpu_tre = document.getElementById("cpu_tre");

//Getting Changing Data [Usage and CPU Temperature]
function cpu_dynamic_data() {

    var session_validation = new XMLHttpRequest();
    session_validation.open("POST", "api/cpu_live_charts");
    session_validation.setRequestHeader("Content-Type", "application/json");

    session_validation.onload = function () {

        if (session_validation.status === 200) {
            //Getting The JSON Ecncoded Data
            var data = JSON.parse(session_validation.responseText);

            //var instance = data[0];

            //Showing CPU Related Details
            cpu_use.innerHTML = `<strong>Usage:</strong> ${data.load_percent}%`;
            cpu_up.innerHTML = `<strong>Up Time:</strong> ${data.uptime}`;

        }
    };

    session_validation.send();
}

setInterval(cpu_dynamic_data, 1000);


//One Time Accessing Sice Threads And No Of Cores Would Not Chnage Time To Time
function cpu_static_data() {

    var session_validation = new XMLHttpRequest();
    session_validation.open("POST", "api/cpu_live_charts");
    session_validation.setRequestHeader("Content-Type", "application/json");

    session_validation.onload = function () {

        if (session_validation.status === 200) {
            //Getting The JSON Ecncoded Data
            var data = JSON.parse(session_validation.responseText);

            //var instance = data[0];

            //Showing CPU Related Details
            cpu_tre.innerHTML = `<strong>Cores:</strong> ${data.cores}`;
            cpu_core.innerHTML = `<strong>Threads:</strong> ${data.threads}`;

        }
    };

    session_validation.send();
}
cpu_static_data();
