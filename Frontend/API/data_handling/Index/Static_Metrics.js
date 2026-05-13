//CPU Metrics
var cpu_core = document.getElementById("cpu_core");
var cpu_tre = document.getElementById("cpu_tre");
function cpu_data() {

    var cpu_fix = new XMLHttpRequest();
    cpu_fix.open("POST", "api/hard_stat");
    cpu_fix.setRequestHeader("Content-Type", "application/json");

    cpu_fix.onload = function () {

        if (cpu_fix.status === 200) {
            //Getting The JSON Ecncoded Data
            var data = JSON.parse(cpu_fix.responseText);

            //Showing CPU Related Details
            cpu_tre.innerHTML = `<strong>Cores:</strong> ${data.cores}`;
            cpu_core.innerHTML = `<strong>Threads:</strong> ${data.threads}`;

        }
    };

    var params = {hardware:"cpu"};
    var jsonparams = JSON.stringify(params);
    cpu_fix.send(jsonparams);
}
cpu_data();

//RAM Metrics
var display_form = document.getElementById("form");
var display_slot = document.getElementById("slot");
function ram_data() {

    var ram_fix = new XMLHttpRequest();
    ram_fix.open("POST", "api/hard_stat");
    ram_fix.setRequestHeader("Content-Type", "application/json");

    ram_fix.onload = function () {

        if (ram_fix.status === 200) {
            //Getting The JSON Ecncoded Data
            var data = JSON.parse(ram_fix.responseText);

            var instance = data[0];

            //Displaying RAM Details
            display_form.innerHTML = `<strong>Form Factor:</strong> ${instance.form_factor}`;
            display_slot.innerHTML = `<strong>Slots Used:</strong> ${instance.slots_used}`;

        }
    };

    var params = {hardware:"ram"};
    var jsonparams = JSON.stringify(params);
    ram_fix.send(jsonparams);
}
ram_data();

//GPU Metrics - Renders to live_spec_main1
function gpu_data() {
    var gpu_fix = new XMLHttpRequest();
    gpu_fix.open("POST", "api/hard_stat");
    gpu_fix.setRequestHeader("Content-Type", "application/json");

    gpu_fix.onload = function () {
        if (gpu_fix.status === 200) {
            var data = JSON.parse(gpu_fix.responseText);
            var gpuList = data[0];

            // Use the NEW GPU-specific container
            var main_div = document.getElementById("live_spec_main1");
            
            // Clear existing GPU blocks to prevent duplicates
            main_div.innerHTML = '';

            for (var i = 0; i < gpuList.length; i++) {
                var currentGPU = gpuList[i];

                // Create single proper GPU block (no nesting)
                var gpu_div = document.createElement("div");
                gpu_div.id = `gpu-block-${i+1}`;
                gpu_div.className = "info_block flex-fill p-3";

                // Clean, proper HTML structure
                gpu_div.innerHTML = `
                    <h6 class="text-center fw-bold mb-3">Graphics Processing Unit ${i+1}</h6>
                    
                    <div class="chart canvas-container mb-3">
                        <canvas id="gpuLoad${i+1}"></canvas>
                    </div>
                    
                    <div class="detailers px-2">
                        <span><strong>${currentGPU.name}</strong></span><br>
                        <span id="gpu-load${i+1}"></span><br>
                        <span><strong>Driver:</strong> ${currentGPU.driver}</span><br>
                        <span><strong>DirectX:</strong> ${currentGPU.directx}</span><br>
                    </div>
                `;

                main_div.appendChild(gpu_div);
            }

            // Initialize GPU charts after DOM update
            if (typeof initializeGPUCharts === 'function') {
                initializeGPUCharts(gpuList.length);
            }
        }
    };

    var params = {hardware: "gpu"};
    var jsonparams = JSON.stringify(params);
    gpu_fix.send(jsonparams);
}

gpu_data();