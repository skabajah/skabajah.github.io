var session = parseInt(localStorage.Session);
var numberOfUsers  = 2;

var sA = 0;
var mA = Math.round(session/numberOfUsers);

var sB = 0;
var mB = Math.round(session/numberOfUsers);


var pauseA = 1;
var pauseB = 1;

var intervalA = setInterval(decrementA, 1000); //10 for testing use 1000 for real time
var intervalB = setInterval(decrementB, 1000); //10 for testing use 1000 for real time

var x = 0;
var y = 0;


function decrementA() {
    if (pauseA == 0) {
        sA = sA % 360 - 1;
        if (sA == -1) {
            sA = 59;
            mA--;
        }
        counterValueA();
    }
}

function decrementB() {
    if (pauseB == 0) {
        sB = sB % 360 - 1;
        if (sB == -1) {
            sB = 59;
            mB--;
        }
        counterValueB();
    }
}

function startA() {
    if (mA==0&&sA==0) {
        pauseA = 1;
    } else {
        pauseA = 0;
        pauseB = 1;
    }
}

function startB() {
    if (mB==0&&sB==0) {
        pauseB = 1;
    } else {
        pauseA = 1;
        pauseB = 0;
    }
}

function pause() {
    pauseA = 1;
    pauseB = 1;
 
    document.getElementById('nameA').innerHTML = localStorage.nameA;
    document.getElementById('nameB').innerHTML = localStorage.nameB;

    counterValueA();
    counterValueB();
}

function counterValueA() {
    document.getElementById("timeBoxA").innerHTML = (mA + ": " + sA + "<p id='minRemaining'>minutes remaining</p>");

    if (mA==0&&sA==0) {
        pauseA=1;
        localStorage.timeUpA=1;
        document.getElementById("timeBoxA").innerHTML = ("Time's Up!");
        $.fn.timeUp(".sideA");
        if (x==0){
            $.fn.ding();
            x++;
        }
    }
}

function counterValueB() {
    document.getElementById("timeBoxB").innerHTML = (mB + ": " + sB +"<p id='minRemaining'>minutes remaining</p>");

    if (mB==0&&sB==0) {
        pauseB=1;
        localStorage.timeUpB=1;
        document.getElementById("timeBoxB").innerHTML = ("Time's Up!");
        $.fn.timeUp(".sideB");
        if (y==0){
            $.fn.ding();
            y++;
        }
    }
}


function end() {
    localStorage.mode="locked";
    localStorage.mA=mA;
    localStorage.mB=mB;
    localStorage.sA=sA;
    localStorage.sB=sB;
    
    pauseA = 1;
    pauseB = 1;
    
    window.location.replace("analytics.html");
}