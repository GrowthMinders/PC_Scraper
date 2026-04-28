// Getting Load For GPUs
function gpu_dynamic_data() {
    var session_validation = new XMLHttpRequest();
    session_validation.open("POST", "api/gpu_live_chart");
    session_validation.setRequestHeader("Content-Type", "application/json");

    session_validation.onload = function () {
        if (session_validation.status === 200) {
            // Your C++ returns an array of objects
            var gpus = JSON.parse(session_validation.responseText);

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

    session_validation.send();
}

setInterval(gpu_dynamic_data, 1000);


function gpu_static_data() {
    var session_validation = new XMLHttpRequest();
    session_validation.open("POST", "api/gpu_live_charts");
    session_validation.setRequestHeader("Content-Type", "application/json");

    session_validation.onload = function () {
        if (session_validation.status === 200) {
            var data = JSON.parse(session_validation.responseText);

            var gpuList = data[0];

            var main_div = document.getElementById("section2");

            for (var i = 0; i < gpuList.length; i++) {
                var currentGPU = gpuList[i];

                var gpu_div = document.createElement("div");

                gpu_div.className = `${currentGPU.name}`; 

                gpu_div.innerHTML = `
                    <span class="gpu-name"><strong>GPU ${i} Name: </strong>${currentGPU.name}</span><br>
                    <span class="gpu-load">  </span><br>
                    <span class="gpu-driver"><strong>Driver Version: </strong>Driver: ${currentGPU.driver}</span><br>
                    <span class="gpu-direct"><strong>DirectX: </strong>${currentGPU.directx}</span><br>
                `;

                main_div.appendChild(gpu_div);
            }
        }
    };

    session_validation.send();
}
gpu_static_data();
