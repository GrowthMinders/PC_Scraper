 var ip_pool = sessionStorage.getItem('user');
 var health = 100;
 var color_rule = "";
 var state = "";
 var helth_display = document.getElementById("health_score");
 var scan_display = document.getElementById("last_scan");
 var recomend_display = document.getElementById("recomender");
 
 function dater(){
   const now = new Date();
 
   const date_set = { day: '2-digit', month: '2-digit', year: 'numeric' };
   var date = new Intl.DateTimeFormat('en-GB', date_set).format(now);

   const time_set = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
   var time = new Intl.DateTimeFormat('en-US', time_set).format(now);

   return date + "-" + time;
 }

 var stamp = dater();
 var [scan_date, scan_time] = stamp.split("-"); 
 
  function dyna_recommend(){
    var health = 100;

    var html_block = "";
    var recomenders = "";

    var health_scorer = new XMLHttpRequest();
    health_scorer.open("POST", "api/recommender");
    health_scorer.setRequestHeader("Content-Type", "application/json");
    health_scorer.onload = function () {
    if(health_scorer.status == 200) {
     var data = JSON.parse(health_scorer.responseText);

     var instance = data[0];   
    
     var active = instance.active;
     var genuine = instance.genuine;
     var update_status = instance.update_status;
     var loss = instance.loss;

     //YAML Ruleset Comparison Logic
     var loss_nubered = parseFloat(loss.match(/[\d.]+/));

     fetch('rules.yaml')
      .then(response => response.text())
      .then(yamlText => {
        // Parse YAML array structure
        var config = jsyaml.load(yamlText);
        var totalScore = 0;

        // Mapping Live Values With The rule Sets Values
        config.rules.forEach(function(rule) {
            var liveValue;

            var current = rule.description; 

            // Map incoming string targets to live parameters
            if (rule.parameter === "active") liveValue = active;
            else if (rule.parameter === "genuine") liveValue = genuine;
            else if (rule.parameter === "update_status") liveValue = update_status;
            else if (rule.parameter === "loss") liveValue = loss_nubered;

            //Rule Set Comparison
            var fail = false;
            if (rule.operator === "eq") fail = (liveValue != rule.value);
            else if (rule.operator === "lte") fail = (liveValue > rule.value);
            else if (rule.operator === "gte") fail = (liveValue >= rule.value);

            // Deducting The Score Related To The Rule
            if (fail) {
              health = health - rule.score;
              recomenders = recomenders + "," + current; 
            }
        });
        
        if(health >= 50){
          color_rule = "green";
          state = "Good";
        }else{
          color_rule = "red";
          state = "Bad";  
        }

        //Display System Health
        helth_display.style.color = `${color_rule}`;
        helth_display.innerText = `Overall Health Score: ${health + "%"} (${state})`;

        //Display Last Scan Date And Time
        scan_display.innerText = `Last Scan: ${scan_date} At ${scan_time}`;

        //Display Details In The Recommendation Engine Section
        var splited = recomenders.split(",");

        //Cleaning Old Data
        recomend_display.innerHTML = "";

        splited.forEach(function(value) {
        if (!value.trim()) return; 

          html_block += `
            <div class="recommendation-badge" style="margin-top: 1vh;">
              <span id="badge-text" style="padding-top: 1vh; padding-bottom: 1vh; background-color: #f8f9fa;">
                <i class="fa-solid fa-triangle-exclamation" style="color: gold; margin-right: 8px;"></i>${value.trim()}
              </span>
            </div><br>`;
        });
    
        //Merging The Recommendations Into The Recommendations Place
        recomend_display.innerHTML = html_block;
        
     })
     .catch(err => console.error("Error reading configuration rules file:", err));
    
   }else{
    Swal.fire({
      title: "Recomendation Engine",
      text: "The Recomendation Engine Is Currently Busy!",
      icon: "error",
      confirmButtonColor: "#e9101085",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
      } else {
        Swal.close();
      }
    });
   }  
  };
  var datacount = {action: ip_pool};
  var jsonDatacount = JSON.stringify(datacount);
  health_scorer.send(jsonDatacount);

  }

  //For The First Time Quick Execution
  dyna_recommend();