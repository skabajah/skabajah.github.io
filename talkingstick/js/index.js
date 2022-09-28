function checkVisit () {
	console.log(localStorage.visit);
	if (localStorage.visit == "undefined") {
		document.getElementById("instructions").style.display="block";
        document.getElementById("instructionsContent").style.display="block";
		console.log(localStorage.visit);
	} else if (localStorage.visit == "old") {
		document.getElementById("instructions").style.display="none";
        document.getElementById("instructionsContent").style.display="none";
	}
    localStorage.timeUpA=0;
    localStorage.timeUpB=0;
}
function start () {
    localStorage.numberOfUsers = 2;
    if (document.getElementById("nameA").value == "") {
        localStorage.nameA = "Beth";
    } else {
        localStorage.nameA = document.getElementById("nameA").value;
    }

    if (document.getElementById("nameB").value == "") {
        localStorage.nameB = "Shadi";
    } else {
        localStorage.nameB = document.getElementById("nameB").value;
    }

    localStorage.Session = document.getElementById("slider").value;
    console.log(localStorage);

    if (document.getElementById("locked").checked == true) {
    	window.location.replace("locked.html");
    }
    if (document.getElementById("unlocked").checked == true) {
    	window.location.replace("unlocked.html");
    }
}