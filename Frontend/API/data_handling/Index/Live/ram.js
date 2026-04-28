var ram = document.getElementById("ram");

//RAM Listing
var usage_ram = document.getElementById("ram_use");
var display_free_ram = document.getElementById("free_ram");  
var display_form = document.getElementById("form");
var display_slot = document.getElementById("slot");

//Getting Changing Data [Usage and Free RAM]
function ram_dynamic_data() {

    var session_validation = new XMLHttpRequest();
    session_validation.open("POST", "api/ram_live_charts");
    session_validation.setRequestHeader("Content-Type", "application/json");

    session_validation.onload = function () {

        if (session_validation.status === 200) {
            //Getting The JSON Ecncoded Data
            var data = JSON.parse(session_validation.responseText);

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

    session_validation.send();
}
setInterval(ram_dynamic_data, 1000);


//One Time Accessing Sice Form Factor And No Of Occupied Slots Would Not Chnage Time To Time
function ram_static_data() {

    var session_validation = new XMLHttpRequest();
    session_validation.open("POST", "api/ram_live_charts");
    session_validation.setRequestHeader("Content-Type", "application/json");

    session_validation.onload = function () {

        if (session_validation.status === 200) {
            //Getting The JSON Ecncoded Data
            var data = JSON.parse(session_validation.responseText);

            var instance = data[0];

            //Displaying RAM Details
            display_form.innerHTML = `<strong>Form Factor:</strong> ${instance.form_factor}`;
            display_slot.innerHTML = `<strong>Slots Used:</strong> ${instance.slots_used}`;

        }
    };

    session_validation.send();
}
ram_static_data();
