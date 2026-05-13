function set_content(){
  var pdf_content = `
    <img src="/Scraper/Frontend/ASSETS/Logo.png" style="width: 200px; height: auto;">
    <p>hurray these is a great one</p>
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