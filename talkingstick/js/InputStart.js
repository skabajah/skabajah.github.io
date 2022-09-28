

function start () {
    localStorage.numberOfUsers = document.getElementById("NumberofUsers").value;
    localStorage.Session = document.getElementById("Session").value;
    console.log(localStorage);

    if (document.getElementById("locked").checked == true) {
    	window.location.replace("locked.html");
    }
    if (document.getElementById("unlocked").checked == true) {
    	window.location.replace("unlocked.html");
    }
}