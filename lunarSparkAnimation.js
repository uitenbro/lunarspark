// Background image and canvas dimensions
const moonImgWidth = 511; // pixels
const orbitDistanceOffset = 100; // pixels
const orbitWidth = 100; // pixels
const orbitVisibilityLowerBound  = 85; // degrees
const orbitVisibilityUpperBound = 275; // degrees
const satelliteVisibilityOffset = 2; //degrees
const satImg1 = new Image()
const satImgSize = 150;

const imageFile = "elphic_south_lunar_pole_ice.png"; // 80-90 degree south pole image with ice sites colored
var initComplete = false;
const minLatitude = -80; // minimum degrees of latitude in image
const shadowTransparency = 0.4 
var originX = 0; 
var originY = 0;
var canvas
var context

// Satellite drawing constants
const satelliteCrossWidth = 20; // pixels
const satelliteCrossHeight = 40; // pixels
const satelliteLaserOffset = 0; //pixels
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
const azimuthLength = 50; // pixels (at the longest)

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawMoon() {
    var moon = document.getElementById('simCanvas');
    moon.style.backgroundImage = 'url('+imageFile+')';
    moon.style.backgroundSize = moonImgWidth+"px";
    moon.style.backgroundPosition = orbitDistanceOffset+"px "+orbitDistanceOffset+"px";
    moon.style.display = "inline";
}

function drawAll(time) {
    drawSunIllumination(); 
    drawVehicles();
    drawLasers();
    drawOrbit(); // TODO: Add orbit back in?
    drawSatellites();
}

function drawOrbit() {
    var acendingNode = lunarSpark.environment.orbit.ascending_node
    // rotate ascending node to aligh 0 with 0 lat, 0 longitude (hidden back side of the display)
    acendingNode = (acendingNode) * (Math.PI/180)
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
    context.arc(originX, originY, canvas.width/2, sunAngle, Math.PI+sunAngle);
    context.closePath();
    context.lineWidth = 1;
    context.fillStyle = "rgba(0,0,0,"+shadowTransparency+")";
    context.fill();
}

function drawSatellites() {
    // TODO: Draw farthest away satelites first so layering is correct
    for (var i=0;i<lunarSpark.satellites.length;i++) {
        if (lunarSpark.satellites[i].active) {
            drawSatellite(i);
        }
    }
}

function drawSatellite(id) {
    var anomaly = lunarSpark.satellites[id].orbit.anomaly;
    var ascendingNode =  lunarSpark.environment.orbit.ascending_node;

    // Only draw a satellite if it is visible in this portion of its orbit
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

        // Draw sub-satellite point TODO: Add back sub satellite back in?
        //drawSubSatellitePoint(id)


        // // Draw Satellite Image
        // if (id==0) {
            // satImg1.src = "satellite-icon.png"; // satellite image

            // satImg1.onload = function() {
                
            //     // draw image...
            //     context.save();
            //     context.translate(originX, originY);
            //     context.rotate(ascendingNode*(Math.PI/180));
            //     context.translate(-originX, -originY);
            //     //context.drawImage(satImg1, -75, 355.5-75, 150, 150)//satelliteCrossWidth, satelliteCrossWidth/2)
            //     //context.drawImage(satImg1, 711-75, 355.5-75, 150, 150)//satelliteCrossWidth, satelliteCrossWidth/2)
            //     context.translate(x, y);
            //     //context.drawImage(satImg1, (x-satImgSize/2), (y-satImgSize/2), satImgSize, satImgSize)//satelliteCrossWidth, satelliteCrossWidth/2)
            //     context.drawImage(satImg1, (-satImgSize/2), (-satImgSize/2), satImgSize, satImgSize)//satelliteCrossWidth, satelliteCrossWidth/2)
            //     // context.drawImage(satImg1, 100, 400, 150, 150)//satelliteCrossWidth, satelliteCrossWidth/2)
            //     // context.drawImage(satImg1, 200, 300, 150, 150)//satelliteCrossWidth, satelliteCrossWidth/2)
            //     // context.drawImage(satImg1, 300, 200, 150, 150)//satelliteCrossWidth, satelliteCrossWidth/2)
            //     // context.drawImage(satImg1, 400, 100, 150, 150)//satelliteCrossWidth, satelliteCrossWidth/2)
            //     // context.drawImage(satImg1, 500, 0, 150, 150)//satelliteCrossWidth, satelliteCrossWidth/2)
            //     console.log(id, ascendingNode*(180/Math.PI), x, x-satImgSize/2, y, y-satImgSize/2)


            //     context.beginPath();
            //     context.arc(x, y, vehicleRadius, 0, 2*Math.PI);
            //     context.closePath();
            //     context.lineWidth = 1;
            //     context.fillStyle = "rgba(FF,FF,FF,1)";
            //     context.fill();
            //     context.strokeStyle = "white";
            //     context.stroke();

            //     context.font = "16px Courier";
            //     context.fillStyle = "white";
            //     // Translate back to the center of satellite on the ellipse and rotate to horizontal
            //     context.translate(x,y);
            //     //context.rotate(-ascendingNode);

            //     // Draw id text with offset to align in the center of cross
            //     context.fillText(id, -5, 5)

            //     context.restore()

            // }
        // }
        // else {

        //     const satImg2 = new Image()
        //     satImg2.onload = function()
        //     {
        //     // draw image...
        //         context.save();
        //         //context.translate(satImg2.width/2, satImg2.height/2,);
        //         //context.rotate(ascendingNode*Math.PI/180)
        //         context.drawImage(satImg2, 200, 200, 200, 200)//satelliteCrossWidth, satelliteCrossWidth/2)
        //         console.log(id, x, y)
        //         context.restore()

        //     }
        //     satImg2.src = "satellite-icon.png"; // satellite image
        // }

        // Save the context then translate to the center of the ellipse
        context.save();
        context.translate(originX,originY);

        // // Rotate ascending node to aligh 0 with north pole (hidden back side of the display)
        // ascendingNode = (ascendingNode)
        // Convert ascending node to radians 
        ascendingNode = ascendingNode * (Math.PI/180)
        // Rotate the canvas to align with the orbit ellipse
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
function drawSubSatellitePoint(id) {

    // Draw satellite shadow on map at the sub-satellite point
    var satLong = lunarSpark.satellites[id].orbit.long; // rad
    var satLat = lunarSpark.satellites[id].orbit.lat;  // rad

    var hyp = (-90-satLat)/(-90-minLatitude) * (canvas.width-(2*orbitDistanceOffset))/2; // pixel length of hypotenuse
    var x = hyp*Math.sin(satLong * (Math.PI/180)); // pixels from central origin
    var y = hyp*Math.cos(satLong * (Math.PI/180)); // pixels from central origin
    x = originX+x; // pixels from canvas orgin
    y = originY-y; // pixels from canvas orgin

    // Draw sub-satellite point
    context.beginPath();
    context.arc(x, y, vehicleRadius, 0, 2*Math.PI);
    context.closePath();
    context.lineWidth = 1;
    context.fillStyle = "rgba(0,0,0,"+shadowTransparency+")";
    context.fill();
    context.strokeStyle = "white";
    context.stroke();
}

function drawVehicles() {
    for (var i=0;i<lunarSpark.vehicles.length;i++) {
        if (lunarSpark.vehicles[i].active) {
            drawVehicle(i);
        }
    }
}

function drawVehicle(id) {
    var vehLat = lunarSpark.vehicles[id].location.lat;
    var vehLong = lunarSpark.vehicles[id].location.long;


    for (var l=0;l<lunarSpark.satellites.length;l++) {

        if (lunarSpark.satellites[l].active) {
            var azimuth = lunarSpark.satellites[l].vehicles[id].azimuth;
            var elevation = lunarSpark.satellites[l].vehicles[id].elevation;
            var lineLength = azimuthLength*Math.cos(elevation*Math.PI/180);

            var hyp = (-90-vehLat)/(-90-minLatitude) * (canvas.width-(2*orbitDistanceOffset))/2; // pixel length of hypotenuse
            var x = hyp*Math.sin(vehLong * (Math.PI / 180.0)); // pixels from central origin
            var y = hyp*Math.cos(vehLong * (Math.PI / 180.0)); // pixels from central origin
            x = originX+x; // pixels from canvas orgin
            y = originY-y; // pixels from canvas orgin

            // If the elevation of the satellite is above zero
            if (elevation >= 0) {
                // Draw the azimuth
                context.save();
                context.translate(x, y);
                // rotate to localc north (vehLong) and then to the azimuth
                context.rotate((vehLong+azimuth)*Math.PI/180);
                context.strokeStyle = "black";
                context.lineWidth = 5.0;
                context.beginPath();
                context.moveTo(0,-vehicleRadius)
                context.lineTo(0, -lineLength-1);
                context.stroke();
                context.strokeStyle = "yellow";
                context.lineWidth = 3.0;
                context.beginPath();
                context.moveTo(0,-vehicleRadius)
                context.lineTo(0, -lineLength);
                context.stroke();
                context.restore();
            }
       }
    }


    // Draw Vehicle circle
    context.beginPath();
    context.arc(x, y, vehicleRadius, 0, 2*Math.PI);
    context.closePath();
    context.lineWidth = 1;
    context.fillStyle = "white";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
    context.font = "14px Courier";
    context.fillStyle = "black";
    var strOffset = id.toString().length*4.5
    context.fillText(id, x-strOffset, y+5);
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
    // Assume every connected laser needs to be drawn
    var hyp = (-90-lat)/(-90-minLatitude) * ((canvas.width/2)-orbitDistanceOffset); // pixel length of hypotenuse is based on veh lat vs total moon width in pixels
    // var vehicleX1 = hyp*Math.sin((long) * (Math.PI / 180.0)); // pixels from central origin
    // var vehicleY1 = hyp*Math.cos((long) * (Math.PI / 180.0)); // pixels from central origin
    var vehicleX = hyp*Math.sin((long - ascendingNode) * (Math.PI / 180.0)); // pixels from central origin 
    var vehicleY = hyp*Math.cos((long -  ascendingNode) * (Math.PI / 180.0)); // pixels from central origin 

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
    // Rotate ascending node to aligh 0 with north pole (hidden back side of the display)
    ascendingNode = (ascendingNode) * (Math.PI/180)
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
}