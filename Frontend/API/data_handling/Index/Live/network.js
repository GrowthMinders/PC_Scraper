var adapter = document.getElementById("adapter");
var band = document.getElementById("band");  
var upload = document.getElementById("up");
var download = document.getElementById("down");

function requester() {

    var session_validation = new XMLHttpRequest();
    session_validation.open("POST", "api/net_live_charts");
    session_validation.setRequestHeader("Content-Type", "application/json");

    session_validation.onload = function () {

        if (session_validation.status === 200) {
            //Getting The JSON Ecncoded Data
            var data = JSON.parse(session_validation.responseText);

            var instance = data[0];

            //Showing Newtwork Related Details
            adapter.innerHTML = `<strong>Adapter Name:</strong> ${instance.adapter}`;
            band.innerHTML = `<strong>Bandwidth:</strong> ${instance.total_kbps} Kbps`;
            upload.innerHTML = `<strong>Upload Speed:</strong> ${instance.send_kbps} Kbps`;
            download.innerHTML = `<strong>Download Speed:</strong> ${instance.receive_kbps} Kbps`;

        }
    };

    session_validation.send();
}

setInterval(requester, 2000);