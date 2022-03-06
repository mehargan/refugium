
function dark() {
    document.body.classList.toggle("dark-mode");

    mode = document.body.classList.contains("dark-mode");

    if(mode == true) {
        localStorage["mode"] = "dark";
    }  
    else {
        localStorage["mode"] = "light";
    }

    // ---- Console.log messages ----//
    // console.log("classList in body: ", mode);
    // lsMode = localStorage.getItem("mode");
    // console.log("mode: ", lsMode);
    
}

window.onload = function () {
    mode = localStorage.getItem("mode");

    if (mode == "dark") {
        document.body.classList.add("dark-mode")
    }

    // ---- Console.log messages ----//
    // console.log("mode start: ", mode);
   
   
};
