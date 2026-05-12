function log_out(){
    Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of your session!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!"
    }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Logged Out!",
            text: "Redirecting to login page...",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            window.location.href = 'http://localhost/Scraper/Frontend/HTML/login.html';
          });
                 
        }  
    });
}