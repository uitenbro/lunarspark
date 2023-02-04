// Background image and canvas dimensions
const desiredCanvasWidth = 511; // pixels
const orbitDistanceOffset = 100; // pixels
const orbitWidth = 200; // pixels
const orbitVisibilityLowerBound  = 46; // degrees
const orbitVisibilityUpperBound = 314; // degrees
const satelliteVisibilityOffset = 5 //degrees
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


// Vehicle drawing constants
const vehicleRadius = 10; // pixels

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
    drawLasers();
    drawVehicles();
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
        if (lunarSpark.satellites[i].active) {
            drawSatellite(lunarSpark.satellites[i].orbit.anomaly, i, lunarSpark.environment.orbit.ascending_node);
        }
    }
}

function drawSatellite(anomaly, id, ascendingNode) {
    // TODO: anomaly (set in model?) and ascending node (should be ascending node) don't seem to be aligned with animation (offset 180 deg and moving CCW)
    var anomaly = (anomaly + 90)%360; // rotate so 0 degrees is the back of screen (north pole) then CW degrees around the orbit
    if (anomaly >= orbitVisibilityLowerBound+satelliteVisibilityOffset && anomaly <= orbitVisibilityUpperBound-satelliteVisibilityOffset) {    
        
        // Calculate pixel distances along the ellipse (a=major axis, b=minor axis, t=angle to the satellite location on the ellipse)
        var a = orbitWidth/2;
        var b = canvas.height/2;
        var t = (anomaly)*(Math.PI / 180.0)
        // x = a cos(t), y = b(cos(t) in pixels
        var x = a*Math.cos(t); // pixels from center of ellipse
        var y = b*Math.sin(t); // pixels from center of ellipse
        // calculate pixel location from canvas origin
        x = originX+x; // pixels from canvas orgin
        y = originY-y; // pixels from canvas orgin

        // Save the context then translate to the center of the satellite on the ellipse
        context.save();
        context.translate(originX,originY)
        // Convert ascending node to radians and rotate the canvas to align with the orbit ellipse
        ascendingNode = (ascendingNode+90) * (Math.PI/180)
        context.rotate(ascendingNode);
        // Translate back to the original canvas origin (still rotated)
        context.translate(-originX,-originY);

        // Draw satellite background and foregroud crosses (still rotated)
        context.fillStyle = "white";
        context.fillRect(x-satelliteCrossWidth/2-1, y-satelliteCrossHeight/2-1, satelliteCrossWidth+2, satelliteCrossHeight+2);
        context.fillRect(x-satelliteCrossHeight/2-1, y-satelliteCrossWidth/2-1, satelliteCrossHeight+2, satelliteCrossWidth+2);    
        context.fillStyle = "blue";
        context.fillRect(x-satelliteCrossWidth/2, y-satelliteCrossHeight/2, satelliteCrossWidth, satelliteCrossHeight);
        context.fillRect(x-satelliteCrossHeight/2, y-satelliteCrossWidth/2, satelliteCrossHeight, satelliteCrossWidth);
        context.font = "16px Courier";
        context.fillStyle = "white";

        // Translate back to the center of satellite on the ellipse and rotate to horizontal
        context.translate(x,y);
        context.rotate(-ascendingNode);
        // Draw id text with offset to align in the center of cross
        context.fillText(id, -5, 5);

        // Restore origin context
        context.restore();
    }
}

function drawVehicles() {
    for (var i=0;i<lunarSpark.vehicles.length;i++) {
        if (lunarSpark.vehicles[i].active) {
            drawVehicle(lunarSpark.vehicles[i].location.lat, lunarSpark.vehicles[i].location.long, i);
        }
    }
}

function drawVehicle(lat, long, id) {
    var hyp = (90-lat)/(90-minLatitude) * (canvas.width-(2*orbitDistanceOffset))/2; // pixel length of hypotenuse
    var x = hyp*Math.sin(long * (Math.PI / 180.0)); // pixels from central origin
    var y = hyp*Math.cos(long * (Math.PI / 180.0)); // pixels from central origin
    x = originX+x; // pixels from canvas orgin
    y = originY-y; // pixels from canvas orgin

    context.beginPath();
    context.arc(x, y, vehicleRadius, 0, 2*Math.PI);
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
        if (lunarSpark.satellites[i].active) {
            for (var j=0;j<lunarSpark.satellites[i].lasers.length;j++) {
                var vehicle = lunarSpark.satellites[i].lasers[j].vehicle;
                if (vehicle != null && vehicle != "---") {  //TODO change to if typeof vehicle then "---" check 
                    var lat = lunarSpark.vehicles[vehicle].location.lat;
                    var long = lunarSpark.vehicles[vehicle].location.long;
                    drawLaser(lunarSpark.satellites[i].orbit.anomaly, lunarSpark.environment.orbit.ascending_node, j, lat, long);
                }
            }
        }
    }
}
function drawLaser(anomaly, ascendingNode, laserNum, lat, long) {
    anomaly = (anomaly + 90)%360; // rotate so 0 degrees is the top of screen then CCW degrees around the orbit
    //if (anomaly >= orbitVisibilityLowerBound+40 && anomaly <= orbitVisibilityUpperBound-40) { 

        var hyp = (90-lat)/(90-minLatitude) * ((canvas.width/2)-orbitDistanceOffset); // pixel length of hypotenuse
        var vehicleX1 = hyp*Math.sin((long) * (Math.PI / 180.0)); // pixels from central origin
        var vehicleY1 = hyp*Math.cos((long) * (Math.PI / 180.0)); // pixels from central origin
        var vehicleX = hyp*Math.sin((long - ascendingNode-90) * (Math.PI / 180.0)); // pixels from central origin
        var vehicleY = hyp*Math.cos((long -  ascendingNode-90) * (Math.PI / 180.0)); // pixels from central origin

        vehicleX = originX+vehicleX; // pixels from canvas orgin
        vehicleY = originY-vehicleY; // pixels from canvas orgin

        var a = orbitWidth/2;
        var b = canvas.height/2;
        var t = (anomaly)*(Math.PI / 180.0)
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

        ascendingNode = (ascendingNode+90) * (Math.PI/180)
        context.save();
        context.translate(originX,originY)
        context.rotate(ascendingNode);
        context.translate(-originX,-originY);

        // Draw laser
        context.strokeStyle = "white";
        context.lineWidth = 5.0;
        context.beginPath();
        context.moveTo(satX, satY);
        context.lineTo(vehicleX, vehicleY);
        context.stroke();
        context.strokeStyle = "Magenta";
        context.lineWidth = 3.0;
        context.beginPath();
        context.moveTo(satX, satY);
        context.lineTo(vehicleX, vehicleY);
        context.stroke();
    
        context.restore();
    //}
}