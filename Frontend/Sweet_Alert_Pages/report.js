function dater(){
  const now = new Date();
 
  const date_set = { day: '2-digit', month: '2-digit', year: 'numeric' };
  var date = new Intl.DateTimeFormat('en-GB', date_set).format(now);

  const time_set = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  var time = new Intl.DateTimeFormat('en-US', time_set).format(now);

  return date + "-" + time;
}

var processor, treads, cores;
var tot, form, slot, ddr;
var device, win, version, license, activation;
var storage1, storage2;
var gpu_name, gpu_vram, gpu_driver, gpu_direct;
var gpu1_name = "", gpu1_vram = "", gpu1_driver = "", gpu1_direct = "";
var external_gpu_html = "";

function data_setter(){
  //CPU DATA
  processor = document.getElementById("cpu_name").textContent;
  processor = processor.replace(/^CPU:\s*/i, '').trim();

  treads = document.getElementById("cpu_tre").textContent;
  treads = treads.replace(/^Threads:\s*/i, '').trim();

  cores = document.getElementById("cpu_core").textContent;
  cores = cores.replace(/^Cores:\s*/i, '').trim();

  //RAM DATA
  capacity = document.getElementById("ram").textContent;
  capacity = capacity.replace(/^RAM:\s*/i, '').trim();

  tot = capacity.replace(/DDR\d+/i, '').trim();
  form = document.getElementById("form").textContent;
  form = form.replace(/^Form Factor:\s*/i, '').trim();

  slot = document.getElementById("slot").textContent;
  slot = slot.replace(/^Slots Used:\s*/i, '').trim();

  ddr = capacity.match(/DDR\d+/i);

  //OS DATA
  device = document.getElementById("device_name").textContent;
  device = device.replace(/^Device Name:\s*/i, '').trim();

  win = document.getElementById("windows_version").textContent;
  win = win.replace(/^OS Version:\s*/i, '').trim();

  version = document.getElementById("build_version").textContent;
  version = version.replace(/^OS Built:\s*/i, '').trim();

  license = document.getElementById("license_pro").textContent;
  license = license.replace(/^License Provider:\s*/i, '').trim();

  activation = document.getElementById("activation").textContent;
  activation = activation.replace(/^Activation Statues:\s*/i, '').trim(); 

  //STORAGE DETAILS
  hdd = document.getElementById("drive").textContent;

  var drive1 = hdd.match(/T-FORCE[^\r\n]+/i);
  var drive2 = hdd.match(/Storage 2: MTFDKBA[^\r\n]+/i);

  storage2 = drive2[0];
  storage2 = storage2.replace(/^Storage 2:\s*/i, '').trim(); 

  storage1 = hdd.replace(drive2[0], '').replace(/[\r\n]+/g, ' ').trim();
  storage1 = storage1.replace(/^Storage 1:\s*/i, '').trim(); 
  

  //GPU DATA
  gpu_in = document.getElementById("internal_gpu").textContent;
  gpu_ex = document.getElementById("external_gpu").textContent;

  //Storing Internal GPU Data
  spliter = gpu_in.match(/(.*?)\s*(\d+\s*GB)/i);
  gpu_name = spliter[1].trim();
  gpu_name = gpu_name.replace(/^Internal GPU:\s*/i, '').trim(); 

  gpu_vram = spliter[2].trim();

  container = document.querySelector(".detailers1");
  spans = container.querySelectorAll("span");
  gpu_driver = spans[2].textContent.trim();
  gpu_driver = gpu_driver.replace(/^Driver:\s*/i, '').trim(); 

  gpu_direct = spans[3].textContent.trim();
  gpu_direct = gpu_direct.replace(/^DirectX:\s*/i, '').trim(); 

  if(gpu_ex.trim() != ""){
    var spliter1 = gpu_ex.match(/(.*?)\s*(\d+\s*GB)/i);
    gpu1_name = spliter1[1].trim();
    gpu1_name = gpu1_name.replace(/^External GPU:\s*/i, '').trim(); 

    gpu1_vram = spliter1[2].trim();

    var container1 = document.querySelector(".detailers2");
    var spans1 = container1.querySelectorAll("span");
    gpu1_driver = spans1[2].textContent.trim();
    gpu1_driver = gpu1_driver.replace(/^Driver:\s*/i, '').trim();
    
    gpu1_direct = spans1[3].textContent.trim();
    gpu1_direct = gpu1_direct.replace(/^DirectX:\s*/i, '').trim(); 


    external_gpu_html = `
      <div style="flex: 1; min-width: 240px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; box-sizing: border-box;">
        <h5 style="margin: 0 0 10px 0; color: #3b82f6; font-size: 13px; text-transform: uppercase; border-bottom: 1px dashed #e2e8f0; padding-bottom: 4px;">External GPU</h5>
        <p style="margin: 4px 0; font-size: 12px; color: #334155;"><strong style="color: #64748b;">Name:</strong> ${gpu1_name}</p>
        <p style="margin: 4px 0; font-size: 12px; color: #334155;"><strong style="color: #64748b;">VRAM:</strong> ${gpu1_vram}</p>
        <p style="margin: 4px 0; font-size: 12px; color: #334155;"><strong style="color: #64748b;">Driver:</strong> ${gpu1_driver}</p>
        <p style="margin: 4px 0; font-size: 12px; color: #334155;"><strong style="color: #64748b;">DirectX:</strong> ${gpu1_direct}</p>
      </div>
    `;
  } else {
    external_gpu_html = "";
  }
}

function set_content(){
  var stamp = dater();
  var [pdf_date, pdf_time] = stamp.split("-"); 
  data_setter();

  var pdf_content = `
    <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b; padding: 10px; box-sizing: border-box; background: #ffffff;">
      
   
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px;">
        <div>
          <img src="/Scraper/Frontend/ASSETS/Logo.png" style="width: 180px; height: auto; display: block;">
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0 0 5px 0; color: #1e293b; font-size: 18px; font-weight: 700; letter-spacing: 0.5px;">SYSTEM DIAGNOSTIC REPORT</h2>
          <p style="margin: 2px 0; font-size: 11px; color: #64748b;"><strong>Date:</strong> ${pdf_date} &nbsp;|&nbsp; <strong>Time:</strong> ${pdf_time}</p>
        </div>
      </div>

   
      <div style="display: flex; gap: 15px; margin-bottom: 15px;">
  
        <div style="flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
          <div style="background: #1e293b; color: #ffffff; padding: 8px 12px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">CENTRAL PROCESSING UNIT (CPU)</div>
          <div style="padding: 12px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #334155; line-height: 1.4;"><strong style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Processor Model</strong>${processor}</p>
            <div style="display: flex; gap: 20px; border-top: 1px solid #f1f5f9; padding-top: 8px; margin-top: 8px;">
              <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b;">Cores:</strong> ${cores}</p>
              <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b;">Threads:</strong> ${treads}</p>
            </div>
          </div>
        </div>

  
        <div style="flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
          <div style="background: #1e293b; color: #ffffff; padding: 8px 12px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">MEMORY (RAM)</div>
          <div style="padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Total Capacity</strong>${tot}</p>
            <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Type</strong>${ddr}</p>
            <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Form Factor</strong>${form}</p>
            <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Slots Used</strong>${slot}</p>
          </div>
        </div>
      </div>

      
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 15px; background: #ffffff;">
        <div style="background: #1e293b; color: #ffffff; padding: 8px 12px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">STORAGE SYSTEM</div>
        <div style="padding: 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
            <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 8px 12px; color: #64748b; font-weight: 600; width: 120px;">Drive Label</th>
              <th style="padding: 8px 12px; color: #64748b; font-weight: 600;">Hardware Device Identifier</th>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 12px; font-weight: 600; color: #334155;">Storage 1</td>
              <td style="padding: 8px 12px; color: #334155; font-family: monospace;">${storage1}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: 600; color: #334155;">Storage 2</td>
              <td style="padding: 8px 12px; color: #334155; font-family: monospace;">${storage2}</td>
            </tr>
          </table>
        </div>
      </div>

      
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 15px; background: #ffffff;">
        <div style="background: #1e293b; color: #ffffff; padding: 8px 12px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">GRAPHICS PROCESSING UNIT (GPU)</div>
        <div style="padding: 12px; display: flex; flex-wrap: wrap; gap: 12px;">
          
          
          <div style="flex: 1; min-width: 240px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; box-sizing: border-box;">
            <h5 style="margin: 0 0 10px 0; color: #3b82f6; font-size: 13px; text-transform: uppercase; border-bottom: 1px dashed #e2e8f0; padding-bottom: 4px;">Internal GPU</h5>
            <p style="margin: 4px 0; font-size: 12px; color: #334155;"><strong style="color: #64748b;">Name:</strong> ${gpu_name}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #334155;"><strong style="color: #64748b;">VRAM:</strong> ${gpu_vram}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #334155;"><strong style="color: #64748b;">Driver:</strong> ${gpu_driver}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #334155;"><strong style="color: #64748b;">DirectX:</strong> ${gpu_direct}</p>
          </div>

         
          ${external_gpu_html}
          
        </div>
      </div>

     
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 20px; background: #ffffff;">
        <div style="background: #1e293b; color: #ffffff; padding: 8px 12px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">OPERATING SYSTEM ENVIRONMENTS</div>
        <div style="padding: 12px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
          <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Device Name</strong>${device}</p>
          <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Windows Version</strong>${win}</p>
          <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Build Version</strong>${version}</p>
          <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">License Type</strong>${license}</p>
          <p style="margin: 0; font-size: 12px; color: #334155;"><strong style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Status</strong>${activation}</p>
        </div>
      </div>


      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 20px;">
        <div>
          <img src="/Scraper/Frontend/ASSETS/Sri_Dedunu_Tech_Solutions.png" style="width: 65px; height: auto; display: block;">
        </div>
        <div style="text-align: right;">
          <span style="font-size: 9px; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px;">&copy; ALL RIGHTS RESERVED BY SRI DEDUNU TECH SOLUTIONS</span>
        </div>
      </div>

    </div>
  `; 

  return pdf_content;
}

function reporter() {
  const element = set_content();
  const opt = {
    margin: 30,
    filename: 'System_Diagnostic_Report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}
