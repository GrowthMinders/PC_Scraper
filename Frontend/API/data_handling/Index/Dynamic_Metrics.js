//CPU Metrics
var cpu_use = document.getElementById("cpu_use");
var cpu_up = document.getElementById("cpu_up"); 

function cpu_data() {

    var cpu_dynamic = new XMLHttpRequest();
    cpu_dynamic.open("POST", "api/hard_dyna");
    cpu_dynamic.setRequestHeader("Content-Type", "application/json");

    cpu_dynamic.onload = function () {

        if (cpu_dynamic.status === 200) {
          var data = JSON.parse(cpu_dynamic.responseText);

          //Showing CPU Related Details
          cpu_use.innerHTML = `<strong>Usage:</strong> ${data.load_percent}%`;
          cpu_up.innerHTML = `<strong>Up Time:</strong> ${data.uptime}`;

        }
    };

    var params = {hardware:"cpu"};
    var jsonparams = JSON.stringify(params);
    cpu_dynamic.send(jsonparams);
}

//RAM Metrics
var ram = document.getElementById("ram");
var usage_ram = document.getElementById("ram_use");
var display_free_ram = document.getElementById("free_ram");

function ram_data() {

    var ram_dynamic = new XMLHttpRequest();
    ram_dynamic.open("POST", "api/hard_dyna");
    ram_dynamic.setRequestHeader("Content-Type", "application/json");

    ram_dynamic.onload = function () {

        if (ram_dynamic.status === 200) {
          //Getting The JSON Ecncoded Data
          var data = JSON.parse(ram_dynamic.responseText);

          var instance = data[0];

          //Displaying RAM Details
          var total_ram = (ram.value || ram.innerText || "").replace(/\s*(ram:|gb|ddr5)\s*/gi, "").trim();

          var totram = parseInt(total_ram);

          var fram = instance.free_ram_gb;

          var usram = totram - fram;

          usage_ram.innerHTML = `<strong>Usage:</strong> ${parseInt((usagePercent = (usram / totram) * 100))}%`;
          display_free_ram.innerHTML = `<strong>Free RAM:</strong> ${instance.free_ram_gb}GB`;
        }
    };

    var params = {hardware:"ram"};
    var jsonparams = JSON.stringify(params);
    ram_dynamic.send(jsonparams);
}

//GPU Metrics
function gpu_data() {
    var gpu_dynamic = new XMLHttpRequest();
    gpu_dynamic.open("POST", "api/hard_dyna");
    gpu_dynamic.setRequestHeader("Content-Type", "application/json");

    gpu_dynamic.onload = function () {
        if (gpu_dynamic.status === 200) {
            var gpus = JSON.parse(gpu_dynamic.responseText);

            gpus.forEach(function(gpu) {
                // Use the exact match selector for classes with spaces/symbols
                var current  = gpu.name;
                var container = document.querySelector('[class="' + current + '"]');

                if (container) {
                    var loadSpan = container.querySelector(".gpu-load");
                    if (loadSpan) {
                       var roundedLoad = Math.round(gpu.load);
                       loadSpan.innerHTML ="<strong>Usage: </strong>" + roundedLoad + "%";
                    }
                } else {
                    console.log("Could not find div with class: " + gpu.name);
                }
            });
        }
    };

    var params = {hardware:"gpu"};
    var jsonparams = JSON.stringify(params);
    gpu_dynamic.send(jsonparams);
}

//Network Metrics
var adapter = document.getElementById("adapter");
var band = document.getElementById("band");  
var upload = document.getElementById("up");
var download = document.getElementById("down");

function network_data() {
    var network_dynamic = new XMLHttpRequest();
    network_dynamic.open("POST", "api/hard_dyna");
    network_dynamic.setRequestHeader("Content-Type", "application/json");

    network_dynamic.onload = function () {

        if (network_dynamic.status === 200) {
            //Getting The JSON Ecncoded Data
            var data = JSON.parse(network_dynamic.responseText);

            var instance = data[0];

            //Showing Newtwork Related Details
            adapter.innerHTML = `<strong>Adapter Name:</strong> ${instance.adapter}`;
            band.innerHTML = `<strong>Bandwidth:</strong> ${instance.total_kbps} Kbps`;
            upload.innerHTML = `<strong>Upload Speed:</strong> ${instance.send_kbps} Kbps`;
            download.innerHTML = `<strong>Download Speed:</strong> ${instance.receive_kbps} Kbps`;

        }
    };

    var params = {hardware:"network"};
    var jsonparams = JSON.stringify(params);
    network_dynamic.send(jsonparams);
}

setInterval(cpu_data, 1000);
setInterval(ram_data, 1000);
setInterval(gpu_data, 1000);
setInterval(network_data, 1000);