//  skabajah

$(document).ready(function() {
$("#purple").click(function(){
	$('body').append('<style>h2,#examples h4,a#exampleLink:hover,#footer i:hover, #signature i:hover,#closePopup:hover{color:#aa44aa;} .btn-default,.logo{background-color:#aa44aa;}.navbar-inverse .navbar-nav>li>a:hover{border-bottom: 5px solid #aa44aa;}#intro{border-bottom: solid 10px #aa44aa;}</style>').hide().fadeIn(1000);   
	});
$("#yellow").click(function(){
	$('body').append('<style>h2,#examples h4,a#exampleLink:hover,#footer i:hover, #signature i:hover,#closePopup:hover{color:#aaaa44;} .btn-default,.logo{background-color:#aaaa44;}.navbar-inverse .navbar-nav>li>a:hover{border-bottom: 5px solid #aaaa44;}#intro{border-bottom: solid 10px #aaaa44;}</style>').hide().fadeIn(1000);
	});
$("#cyan").click(function(){
	$('body').append('<style>h2,#examples h4,a#exampleLink:hover,#footer i:hover, #signature i:hover,#closePopup:hover{color:#44aaaa;} .btn-default,.logo{background-color:#44aaaa;}.navbar-inverse .navbar-nav>li>a:hover{border-bottom: 5px solid #44aaaa;}#intro{border-bottom: solid 10px #44aaaa;}</style>').hide().fadeIn(1000);   
	});
$("#serif").click(function(){
	$('body').append("<style>body,h1,h2,h3,h4,h5,h6{font-family:'Kreon',serif;}</style>").hide().fadeIn(1000);   
	});
$("#sans").click(function(){
	$('body').append("<style>body,h1,h2,h3,h4,h5,h6{font-family:'Josefin Sans',Tahoma, sans-serif;}</style>").hide().fadeIn(1000);   
	});
$("#mono").click(function(){
	$('body').append("<style>body,h1,h2,h3,h4,h5,h6{font-family: 'Ubuntu Mono', monospace;}</style>").hide().fadeIn(1000);   
	});
	
$(".sun").click(function(){
	$('body').append(
	'<style>#intro, #signature  { background-color: #eee;} h1,h6,h5,label,#description,i,.navbar-inverse .navbar-nav>li>a {color: #333 !important;} #footer, div#bs-example-navbar-collapse-1 { background-color: #fefefe; }button.navbar-toggle.slow.collapsed { background: #b3b3b3;}</style>'
	).hide().fadeIn(1000);   
	});	
	
});
