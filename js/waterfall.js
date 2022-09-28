
var interval = 42; /* less is faster */
var loc = 3;
var w = window.screen.width;
var h = window.screen.height;
var rectsize = 50;

    
function start() {
    // document.getElementById("start").style.display = "none";

    // var w = window.innerWidth;
    // var h = window.innerHeight;

    paper = Raphael("mySVG");
    paper.rect(0, 0, w, h).attr(
        'fill', 'none'
        );

    setInterval(moveRectangles, interval);

    rectangles = [];
}

function moveRectangles() {
    for (var i = 0; i < rectangles.length; i++) {
        var rect = rectangles[i];
        if (!rect) continue;

        //assign the rectangle's old "y" coordinate value to the variable "oldY"
        var oldY = rect.attr("y");
        // var h = window.innerHeight;

        if (oldY >= h) { // reached the bottom yet?
            // updateScore();
            rect.remove(); //remove the rectangle from the Raphael/SVG canvas
            rectangles[i] = null;
        } else { // not at the bottom
            rect.attr({
                "y": oldY + loc
            }); //move the rectangle down 3 pixels from its oldY location
        }
    }
    if (Math.random() < 0.035 && loc >0 ) {
        //create a new rectangle at a random location along the top of the SVG canvas
        //fill it with teal, and assign it to the variable "newRect"
        // var w = window.innerWidth;

        var newX = Math.random() * w; // width
        var size = (Math.random() +0.5) * rectsize; // random size for rectangles
        var newRect = paper.rect(newX, 0, size, size).attr({
            "fill": "none", "stroke":"white", "stroke-width":"4"
        });
        handleClick = function (event) {
            hits++;
            updateScore();
            this.remove();
        };
        //add an event handler to the new rectangle that points to the handleClick function
        newRect.click(handleClick);
        rectangles.push(newRect);
    }
}

