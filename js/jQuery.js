// skabajah

$(document).ready(function() {
    var h = $(window).innerHeight();
    var w = $(window).innerWidth();

      $("#intro").css("height", h);



      if (w<h) {
        console.log("now");
        $('.tooltip').css({"width": "100%", "height": "30%" });
        $('.popup').css({"width": "100%"});
      }
      if (w>1700) {
        $('h6').css({"font-size":"12pt"});
        $('h5, label, a#exampleLink').css({"font-size":"14pt"});
        $('h4, #description').css({"font-size":"18pt"});
        $('h3, .tooltip').css({"font-size":"20pt"});
        $('h2').css({"font-size":"25pt"});
        $('h1').css({"font-size":"30pt"});
        $('#closePopup').css({"font-size":"60pt"});

      }


  $("#examples img").click(function(){
    $(".tooltip").hide( "slow" );
    $(this).parent().find('h6').show( "slow" );
  });
  $(".fa").click(function(){
    $(".tooltip").hide( "slow" );
  });

  $("#navX").click(function(){
    $(this).toggleClass( "fa-times fa-bars");
      $("#bs-example-navbar-collapse-1" ).toggle('slow', function() {
        $(this).toggleClass('');
       });
    // $('#theme').toggleClass("theme2"); // .hide().show('slow');
    // $('#theme').toggleClass("theme1"); // .hide().show('slow');

    // $('.theme2').css({"visibility": "visible" });


  });
     
//     darkmode toggle 
    $(".sun").click(function(){
        $(this).removeClass( "sun" ).addClass( "moon" );
 
	$('body').append(' <style class="extra">#intro, #signature  { background-color: #eee;} h1,h6,h5,label,#description,i,.navbar-inverse .navbar-nav>li>a {color: #333 !important;} #footer, div#bs-example-navbar-collapse-1 { background-color: #fefefe; }button.navbar-toggle.slow.collapsed { background: #b3b3b3;}#navX {color: #FFF;}</style> ').hide().fadeIn(1000);       
        
    });
	
	
    $(".moon").click(function(){
        $(".extra").remove();
        $(".moon").removeClass( "moon" ).addClass( "sun" );
  
    }); 

  $("#goDown").hover(function() {
      $(this).addClass("bounce animated");
  }, function() {
      $(this).removeClass("bounce animated");
  });
  $(window).scroll(function() {
      var h = $(window).innerHeight();
      var s = $(window).scrollTop();
      console.log(s);
      if (s > (h - 60)) {
          $(".navbar-inverse").hide( "slow" );
      } else if (s < h) {
          $(".navbar-inverse").show( "slow" );
      }
      if (s<200) {
        $(".tooltip").hide( "slow" );
        $("#showup").hide( "slow" );
      }
  });
  $(window).resize(function() {
      var h = $(window).innerHeight();
      var w = $(window).innerWidth();
      $("#intro").css("height", h);
      if (w<h) {
        $('.tooltip').css({"width": "100%", "height": "30%" });
        $('.popup').css({"width": "100%"});
      }
      if (w>h) {
        console.log("back");
        $('.tooltip').css({"width": "25%", "height": "100%" });
        $('.popup').css({"width": "75%"});
      }
      
      
    //   $("#mySVG").css("height", h);
    //   $("#mySVG").css("width", w);


  });
  $('#examples img').click(function() {
      $('#showup').css('display', 'block');
      $('#popUpImg').attr('src', this.src);
      var i = this.id;
      if (i == 1) {
          var a = 'https://public.tableau.com/app/profile/skabajah/viz/USElections2020/2020' //Elections
      }
      if (i == 2) {
          var a = 'https://public.tableau.com/app/profile/skabajah/viz/testCOVID-19/COVID19' //Covid
      }
 
      if (i == 3) {
          var a = 'https://public.tableau.com/app/profile/skabajah/viz/SingleFamilyRent/Dashboard' //Rent
      }
 
      if (i == 4) {
          var a = 'https://public.tableau.com/app/profile/skabajah/viz/CAAdjustedGrossIncomeAGI/Dashboard'  // AGI
      }
     
      $('#exampleLink').attr('href', a);
  });
  $('#closePopup').click(function() {
      $('#showup').css('display', 'none');
  });
  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname
            .replace(/^\//, '') && location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this
                .hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
  });
    $("body").keydown(function(e) {
        if (e.keyCode == 27) {
            // esc
            $("#showup").hide();
            $(".tooltip").hide( "slow" );
            
            console.log("esc");
        }
        return e.keyCode;
    });
});
