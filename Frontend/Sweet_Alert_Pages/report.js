function dater(){
  const now = new Date();
 
  const date_set = { day: '2-digit', month: '2-digit', year: 'numeric' };
  var date = new Intl.DateTimeFormat('en-GB', date_set).format(now);

  const time_set = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  var time = new Intl.DateTimeFormat('en-US', time_set).format(now);

  return date + "-" + time;
}

function set_content(){
  var stamp = dater();
  var [pdf_date, pdf_time] = stamp.split("-"); 

  var pdf_content = `
    <div class="container" style="display: flex; width: 100%;">
      <div class="left-side" style="flex: 4;">
        <img src="/Scraper/Frontend/ASSETS/Logo.png" style="width: 200px; height: auto;">
      </div>

      <div class="right-side" style="flex: 2; display: flex; justify-content: center; align-items: center;">
        <div id="final_out" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
          <div id="final_out">
             <h6>Generated Date: ${pdf_date}</h6>
             <h6>Generated Time: ${pdf_time}</h6>
          </div>
        </div>
      </div>
    </div>

    
  `; 

  return pdf_content;
}


function reporter() {
  const element = set_content();
  const opt = {
    margin: 20,
    filename: 'document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'pt', format: 'a4' }
  };
  html2pdf().set(opt).from(element).save();
}