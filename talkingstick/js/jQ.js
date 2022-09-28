$(document).ready(function () {

    $("#startA").click(function () {
        
        if (localStorage.timeUpA==0) {
            startA();
            $('.sideA').css("background-color","#4aa");
            $('#startA').css("visibility","hidden");
        }
        if (localStorage.timeUpB==0) {
            $('.sideB').css("background-color","#EEE");
            $('#startB').css("visibility","visible");
        }
            $('#pause').css("background-color","#EEE");
    });

    $("#startB").click(function () {
        
        if (localStorage.timeUpA==0) {
            $('.sideA').css("background-color","#EEE");
            $('#startA').css("visibility","visible");
        }
        if (localStorage.timeUpB==0) {
            startB();
            $('.sideB').css("background-color","#4aa");
            $('#startB').css("visibility","hidden");
        }
            $('#pause').css("background-color","#EEE");
    });

    $("#pause").click(function () {
        $('.sideA').css("background-color","#E8B2B2");
        $('.sideB').css("background-color","#E8B2B2");
        if (localStorage.timeUpA==0) {  $('#startA').css("visibility","visible");}
        if (localStorage.timeUpB==0) {  $('#startB').css("visibility","visible");}

        $('#pause').css("background-color","#B20000");
        pause();
    });

    $("#end").click(function () {
        end();
        $('.sideB').css("background-color","#EEE");
        $('#startB').css("visibility","visible");
        $('.sideA').css("background-color","#EEE");
        $('#startA').css("visibility","visible");
        $('#pause').css("background-color","#EEE");   
        $('#end').css("background-color","#B20000");
    });

    $("#instructions").click(function () {
        $('#instructions').css("display","none");
        $('#instructionsContent').css("display","none");
        localStorage.visit = "old";
    });
    $("#instructionsContent").click(function () {
        $('#instructions').css("display","none");
        $('#instructionsContent').css("display","none");
        localStorage.visit = "old";
    });

    $( ".fa-refresh" ).click(function() {
        window.location.href = 'index.html';
    });
    $( ".fa-info" ).click(function() {
         $("#instructions").css("display","block");
         $("#instructionsContent").css("display","block");
    });

});

     
$.fn.timeUp = function(e) { 
    console.log(localStorage.timeUpB);
    $(e).css("background-color","#E8B2B2");
}

$.fn.ding = function() { 
    if (localStorage.timeUpA==1 || localStorage.timeUpB==1) {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'media/ding.mp3');
        audioElement.setAttribute('autoplay', 'autoplay'); 
    }
}
