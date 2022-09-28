var session = parseInt(localStorage.Session);
var mode = localStorage.mode;
var sessionEach = (session/2)*60;

var mA = parseInt(localStorage.mA);
var mB = parseInt(localStorage.mB);
var sA = parseInt(localStorage.sA);
var sB = parseInt(localStorage.sB);

if (mode =="locked")  {
  
  var counterA = (sessionEach) -(mA*60+sA);
  var counterB = (sessionEach) -(mB*60+sB);
  
  var percentA = Math.round(counterA/(counterA+counterB)*100);
  var percentB = Math.round(counterB/(counterA+counterB)*100);

  var mAspoken = session/2-mA-1;
  var mBspoken = session/2-mB-1;
  
  var sAspoken = 60 - sA;
  var sBspoken = 60 - sB;

  if (sAspoken ==60) {sAspoken = 0 ; mAspoken++;}
  if (sBspoken ==60) {sBspoken = 0 ; mBspoken++;}

} else if (mode == "unlocked") {
    var mAspoken = mA;
    var mBspoken = mB;
    var sAspoken = sA;
    var sBspoken = sB;

    var counterA = (mA*60)+sA;
    var counterB = (mB*60)+sB;
    
    var percentA = Math.round(counterA/(counterA+counterB)*100);
    var percentB = Math.round(counterB/(counterA+counterB)*100);
} 

function result () {

  if (sAspoken<10) {
    sAspoken = "0"+sAspoken;
  }
  if (sBspoken<10) {
    sBspoken = "0"+sBspoken;
  }

    document.getElementById("result").innerHTML = (localStorage.nameA + " spoke for: " +   mAspoken + ":"+  sAspoken + " minutes <br>" 
      + localStorage.nameB + " spoke for: " +   mBspoken + ":"+  sBspoken + " minutes");
}
/*
if (sA && sB < 60){// fix this for 1:10
  result();  
  document.getElementById("graph").innerHTML = ("<p>We provide analytics for conversations longer than one minute. <br>Please speak longer if you would like to see a graph.</p>"); 
*/

function morris () {  
  
  Morris.Donut({
        element: 'graph',
        data: [
          {value: percentA, label: localStorage.nameA},
          {value: percentB, label: localStorage.nameB},
             ],
        formatter: function (x) { return x + "%"}
      }).on('click', function(i, row){
        console.log(i, row);
      });
      result();
  
}