// Background image and canvas dimensions
const desiredCanvasWidth = 360; // pixels
const orbitDistanceOffset = 60; // pixels
const orbitWidth = 50; // pixels
const orbitVisibilityLowerBound  = 50; // degrees
const orbitVisibilityUpperBound = 310; // degrees
const img = new Image(); // Create new img element
//const imageFile = "labeled_lunar_south_pole.jpg"; // 80-90 degree south pole image with sites labeled
const imageFile = "elphic_south_lunar_pole_ice.png"; // 80-90 degree south pole image with ice sites colored
var initComplete = false;
const minLatitude = 80; // minimum degrees of latitude in image
const shadowTransparency = 0.4 
var originX = 0; 
var originY = 0;
var canvas
var context

// Satellite drawing constants
const satelliteCrossWidth = 20; // pixels
const satelliteCrossHeight = 40; // pixels
const satelliteLaserOffset = 9; //pixels
const laser0xOffset = 2*satelliteLaserOffset;
const laser1xOffset = satelliteLaserOffset; 
const laser2xOffset = -satelliteLaserOffset;
const laser3xOffset = -2*satelliteLaserOffset;
const laser0yOffset = 0;
const laser1yOffset = 0;
const laser2yOffset = 0;
const laser3yOffset = 0;


// Customer drawing constants
const customerRadius = 10; // pixels

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawMoon() {
    var moon = document.getElementById('simCanvas');
    moon.style.backgroundImage = 'url('+imageFile+')';
    moon.style.backgroundSize = desiredCanvasWidth+"px";
    moon.style.backgroundPosition = orbitDistanceOffset+"px "+orbitDistanceOffset+"px";
    moon.style.display = "inline";
}

function drawAll(time) {
    drawSunIllumination(); 

    // drawLaser((time+30)%360, time%360,0, 85, 30);
    // drawLaser((time+60)%360, time%360,0, 85, -60);
    // drawLaser((time+90)%360, time%360,0, 90, 10);
    // drawLaser((time+120)%360, time%360,0, 82, 15);  
    // drawLaser((time+150)%360, time%360,0, 86, 45); 
    // drawLaser((time+30)%360, time%360,1, 85, 30)  
    // drawLaser((time+30)%360, time%360,2, 85, -60)  
    // drawLaser((time+30)%360, time%360,3, 82, 15)  
    drawLasers();
    drawCustomers();
    drawOrbit();
    drawSatellites();
}

function drawOrbit() {
    var acendingNode = lunarSpark.environment.orbit.ascending_node
    acendingNode = (acendingNode+90) * (Math.PI/180)
    context.strokeStyle = "black";
    context.lineWidth = 5.0;
    context.beginPath();
    context.ellipse(originX, originY, orbitWidth/2, canvas.height/2, acendingNode, orbitVisibilityLowerBound*(Math.PI/180), orbitVisibilityUpperBound*(Math.PI/180));
    context.stroke();
    context.strokeStyle = "yellow";
    context.lineWidth = 3.0;
    context.beginPath();
    context.ellipse(originX, originY, orbitWidth/2, canvas.height/2, acendingNode, orbitVisibilityLowerBound*(Math.PI/180), orbitVisibilityUpperBound*(Math.PI/180));
    context.stroke();
}

function drawSunIllumination () {
    var sunAngle = lunarSpark.environment.sun_angle;
    sunAngle = (sunAngle)*(Math.PI / 180.0);
    context.beginPath();
    context.arc(originX, originY, canvas.width/2, 0+sunAngle, Math.PI+sunAngle);
    context.closePath();
    context.lineWidth = 1;
    context.fillStyle = "rgba(0,0,0,"+shadowTransparency+")";
    context.fill();
}

function drawSatellites() {
    // TODO: Draw farthest away satelites first so layering is correct
    for (var i=0;i<lunarSpark.satellites.length;i++) {
        drawSatellite(lunarSpark.satellites[i].orbit_angle, i, lunarSpark.environment.orbit.ascending_node);
    }
}

function drawSatellite(deg, id, orbitAngle) {
    var deg = (deg + 90)%360; // rotate so 0 degrees is the top of screen then CCW degrees around the orbit
    if (deg >= orbitVisibilityLowerBound+8 && deg <= orbitVisibilityUpperBound-8) {    
        var a = orbitWidth/2;
        var b = canvas.height/2;
        var t = (deg)*(Math.PI / 180.0)
        var x = a*Math.cos(t); // pixels from central origin
        var y = b*Math.sin(t); // pixels from central origin
        x = originX+x; // pixels from canvas orgin
        y = originY-y; // pixels from canvas orgin

        orbitAngle = (orbitAngle+90) * (Math.PI/180)
        context.save();
        context.translate(originX,originY)
        context.rotate(orbitAngle);
        context.translate(-originX,-originY);

        context.fillStyle = "white";
        context.fillRect(x-satelliteCrossWidth/2-1, y-satelliteCrossHeight/2-1, satelliteCrossWidth+2, satelliteCrossHeight+2);
        context.fillRect(x-satelliteCrossHeight/2-1, y-satelliteCrossWidth/2-1, satelliteCrossHeight+2, satelliteCrossWidth+2);    
        context.fillStyle = "blue";
        context.fillRect(x-satelliteCrossWidth/2, y-satelliteCrossHeight/2, satelliteCrossWidth, satelliteCrossHeight);
        context.fillRect(x-satelliteCrossHeight/2, y-satelliteCrossWidth/2, satelliteCrossHeight, satelliteCrossWidth);
        context.font = "16px Courier";
        context.fillStyle = "white";

        context.translate(x,y);
        context.rotate(-orbitAngle);
        context.translate(-x,-y)
        context.fillText(id, x-5, y+5);

        context.restore();
    }
}

function drawCustomers() {
    for (var i=0;i<lunarSpark.customers.length;i++) {
        drawCustomer(lunarSpark.customers[i].location.lat, lunarSpark.customers[i].location.long, i);
    }
}

function drawCustomer(lat, long, id) {
    var hyp = (90-lat)/(90-minLatitude) * (canvas.width-(2*orbitDistanceOffset))/2; // pixel length of hypotenuse
    var x = hyp*Math.sin(long * (Math.PI / 180.0)); // pixels from central origin
    var y = hyp*Math.cos(long * (Math.PI / 180.0)); // pixels from central origin
    x = originX+x; // pixels from canvas orgin
    y = originY-y; // pixels from canvas orgin

    context.beginPath();
    context.arc(x, y, customerRadius, 0, 2*Math.PI);
    context.closePath();
    context.lineWidth = 1;
    context.fillStyle = "white";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
    context.font = "16px Courier";
    context.fillStyle = "black";
    context.fillText(id, x-5, y+5);
}
function drawLasers() {
    for (var i=0;i<lunarSpark.satellites.length;i++) {
        for (var j=0;j<lunarSpark.satellites[i].lasers.length;j++) {
            var customer = lunarSpark.satellites[i].lasers[j].customer;
            var lat = lunarSpark.customers[customer].location.lat;
            var long = lunarSpark.customers[customer].location.long;
            if (customer != null) {
                drawLaser(lunarSpark.satellites[i].orbit_angle, lunarSpark.environment.orbit.ascending_node, j, lat, long);
            }
        }
    }
}
function drawLaser(satDeg, orbitAngle, laserNum, lat, long) {
    satDeg = (satDeg + 90)%360; // rotate so 0 degrees is the top of screen then CCW degrees around the orbit
    if (satDeg >= orbitVisibilityLowerBound+40 && satDeg <= orbitVisibilityUpperBound-40) { 

        var hyp = (90-lat)/(90-minLatitude) * ((canvas.width/2)-orbitDistanceOffset); // pixel length of hypotenuse
        var customerX1 = hyp*Math.sin((long) * (Math.PI / 180.0)); // pixels from central origin
        var customerY1 = hyp*Math.cos((long) * (Math.PI / 180.0)); // pixels from central origin
        var customerX = hyp*Math.sin((long - orbitAngle-90) * (Math.PI / 180.0)); // pixels from central origin
        var customerY = hyp*Math.cos((long -  orbitAngle-90) * (Math.PI / 180.0)); // pixels from central origin

        customerX = originX+customerX; // pixels from canvas orgin
        customerY = originY-customerY; // pixels from canvas orgin

        var a = orbitWidth/2;
        var b = canvas.height/2;
        var t = (satDeg)*(Math.PI / 180.0)
        var satX = a*Math.cos(t); // pixels from central origin
        var satY = b*Math.sin(t); // pixels from central origin
        satX = originX+satX; // pixels from canvas orgin
        satY = originY-satY; // pixels from canvas orgin

        // Set laser offset
        switch(laserNum) {
          case 0:
            satX = satX + laser0xOffset;
            satY = satY + laser0yOffset
            break;
          case 1:
            satX = satX + laser1xOffset;
            satY = satY + laser1yOffset        
            break;
          case 2:
            satX = satX + laser2xOffset;
            satY = satY + laser2yOffset
            break;
          case 3:
            satX = satX + laser3xOffset;
            satY = satY + laser3yOffset        
            break;
          default:
        }

        orbitAngle = (orbitAngle+90) * (Math.PI/180)
        context.save();
        context.translate(originX,originY)
        context.rotate(orbitAngle);
        context.translate(-originX,-originY);

        // Draw laser
        context.strokeStyle = "white";
        context.lineWidth = 5.0;
        context.beginPath();
        context.moveTo(satX, satY);
        context.lineTo(customerX, customerY);
        context.stroke();
        context.strokeStyle = "Magenta";
        context.lineWidth = 3.0;
        context.beginPath();
        context.moveTo(satX, satY);
        context.lineTo(customerX, customerY);
        context.stroke();
    
        context.restore();
    }
}