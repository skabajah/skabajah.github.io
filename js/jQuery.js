 // skabajah
 $(document).ready(function() {
 	
  // variables
 	var h = $(window).innerHeight();
 	var w = $(window).innerWidth();
 	var t = "3000";
  console.log('t:',t);


  // INTRO

 	// $("#intro_old").css("height", h);

 	if (w < h) {
 		console.log("now");
 		$('.tooltip').css({
 			"width": "100%",
 			"height": "30%"
 		});
 		$('.popup').css({
 			"width": "100%"
 		});
 	}


 	if (w > 1700) {
 		$('h6').css({
 			"font-size": "12pt"
 		});
 		$('h5, label, a#exampleLink').css({
 			"font-size": "14pt"
 		});
 		$('h4, #description').css({
 			"font-size": "18pt"
 		});
 		$('h3, .tooltip').css({
 			"font-size": "20pt"
 		});
 		$('h2').css({
 			"font-size": "25pt"
 		});
 		$('h1').css({
 			"font-size": "30pt"
 		});
 		$('#closePopup').css({
 			"font-size": "60pt"
 		});
 	}




   
  

  // NAVIGATION 
  // nav class toggle 
  $("#navX").click(function() {
    $(this).toggleClass("fa-times fa-bars");
    $("#bs-example-navbar-collapse-1").toggle('slow', function() {
      $(this).toggleClass('');
    });
  });

  $(".navbar-inverse .navbar-nav>li>a").click(function() {
    $("#navX").toggleClass("fa-times fa-bars");
    $("#bs-example-navbar-collapse-1").toggle('slow', function() {
      $("#navX").toggleClass('');
    });
  });


  
  
 	// minimize nav-bar 
 	$(window).scroll(function() {
 		var h = $(window).innerHeight();
 		var s = $(window).scrollTop();
 		console.log(s);
 		if (s > (h - 60)) {
 			$(".navbar-inverse").hide("slow");
 		} else if (s < h) {
 			$(".navbar-inverse").show("slow");
 		}
 		if (s < 200) {
 			$(".tooltip").hide("slow");
 			$("#showup").hide("slow");
 		}
 	});


 	 
  // EXAMPLES 

 	// pop examples 
 	$('#examples img').click(function() {
 		$('#showup').css('display', 'block');

 		var i = this.id;
    
    if (i=="deardata" ) {
      // $('#exampleLink').remove(); 
      $('#popUpImg').attr('src', 'media/deardata.gif');
      // $('#DearDataCarousel').toggleClass('hidden', 'popup');

    }

    if (i=="twonumbers" ) {
      $('#popUpImg').attr('src', this.src);
    } 
   
   if (i=="zipcodes" ) {
      $('#popUpImg').attr('src', this.src);
    }

   

 		if (i == 1) {
 			// var a = 'https://public.tableau.com/app/profile/skabajah/viz/USElections2020/2020' //Elections
      $('#popUpImg').attr('src', 'media/lego.gif');

 		}
 		if (i == 2) {
 			// var a = 'https://public.tableau.com/app/profile/skabajah/viz/testCOVID-19/COVID19' //Covid
      $('#popUpImg').attr('src', 'media/covid.gif');

 		}
 		// if (i == 3) {
 		// 	var a = 'https://public.tableau.com/app/profile/skabajah/viz/SingleFamilyRent/Dashboard' //Rent
    //       $('#popUpImg').attr('src', this.src);

 		// }
 		// if (i == 4) {
 		// 	var a = 'https://public.tableau.com/app/profile/skabajah/viz/CAAdjustedGrossIncomeAGI/Dashboard' // AGI
 		// }
   
    // $('#exampleLink').attr('href', a);

 	});

 	// close examples 
 	$('#closePopup').click(function() {
 		$('#showup').css('display', 'none');
 	});

  // escape to close tooltip 
  $("body").keydown(function(e) {
    if (e.keyCode == 27) {
      // esc
      $("#showup").hide();
      $(".tooltip").hide("slow");
      console.log("esc");
    }
    return e.keyCode;
  });

  $("#examples img").click(function() {
    $(".tooltip").hide("slow");
    $(this).parent().find('h6').show("slow");
  });
  
  $(".fa").click(function() {
    $(".tooltip").hide("slow");
  });


  // FOOTER 

 	// go up from footer) 
 	$(function() {
 		$('a[href*=#]:not([href=#])').click(function() {
 			if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
 				var target = $(this.hash);
 				target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
 				if (target.length) {
 					$('html,body').animate({
 						scrollTop: target.offset().top
 					}, 1000);
 					return false;
 				}
 			}
 		});
 	});





 });
