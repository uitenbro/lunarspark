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

// Lunar constants
const moonRadius = 1740; // km 

// Customer drawing constants
const customerRadius = 10; // pixels

// Satellite drawing constants
const satelliteCrossWidth = 20; // pixels
const satelliteCrossHeight = 40; // pixels
const satelliteLaserOffset = 18; //pixels
const laser0xOffset = 0;
const laser1xOffset = 0; 
const laser2xOffset = satelliteLaserOffset;
const laser3xOffset = -satelliteLaserOffset;
const laser0yOffset = -satelliteLaserOffset;
const laser1yOffset = satelliteLaserOffset;
const laser2yOffset = 0;
const laser3yOffset = 0;



// Orbit inputs
const orbitAlititude = 402; // km
const orbitRadius = moonRadius + orbitAlititude; // km
const orbitPeriod = 148; // min

// Model parameters
const minPerDay = 60*24; // minutes per day
var time = 0 // minuites
const refreshRate = 100 // 50 msec (20Hz), 100 msec (10Hz);
const timeStep = 1; // min/refresh
var simState = "pause"

function drawAll(time) {


    drawSunIllumination(time%360); 

    drawLaser((time+30)%360, time%360,0, 85, 30);
    drawLaser((time+60)%360, time%360,0, 85, -60);
    drawLaser((time+90)%360, time%360,0, 90, 10);
    drawLaser((time+120)%360, time%360,0, 82, 15);  
    drawLaser((time+150)%360, time%360,0, 86, 45); 

    drawLaser((time+30)%360, time%360,1, 85, 30)  
    drawLaser((time+30)%360, time%360,2, 85, -60)  
    drawLaser((time+30)%360, time%360,3, 82, 15)  

    drawCustomer(85, 30, "1");
    drawCustomer(85, -60, "2");
    drawCustomer(90, 0, "3");
    drawCustomer(82, 15, "4");
    drawCustomer(84, 30, "5");
    drawCustomer(86, 45, "6");
    drawCustomer(88, -165, "7");
    drawCustomer(82, -90, "8");

    drawOrbit(time%360);
    drawSatellite((time+30)%360, "0", time%360);
    drawSatellite((time+60)%360, "1", time%360);
    drawSatellite((time+90)%360, "2", time%360);
    drawSatellite((time+120)%360, "3", time%360);
    drawSatellite((time+150)%360, "4", time%360);

}

function drawMoon() {

    moon = document.getElementById('simCanvas');
    moon.style.backgroundImage = 'url('+imageFile+')';
    moon.style.backgroundSize = desiredCanvasWidth+"px";
    moon.style.backgroundPosition = orbitDistanceOffset+"px "+orbitDistanceOffset+"px";
    moon.style.display = "inline";
}

function updateDisplay() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    //const img = moon;
    // img.src = imageFile; // Set source path
    // img.onload = function(){

        // Setup global canvas coordinates based on image scaling
        // imageScaleFactor = desiredCanvasWidth/img.width;
        // canvas.width = img.width*imageScaleFactor + 2*orbitDistanceOffset
        // canvas.height = img.height*imageScaleFactor + 2*orbitDistanceOffset;     
        // originX = canvas.width/2; // intentionall global
        // originY = canvas.height/2; // intentionally global

        // Add moon image
       //contextBG.drawImage(img, orbitDistanceOffset, orbitDistanceOffset, img.width*imageScaleFactor, img.height*imageScaleFactor)

        // // Add outline to moon
        // context.strokeStyle = "black";
        // context.lineWidth = 2.0;
        // context.beginPath();
        // context.arc(originX, originY, (canvas.width-2*orbitDistanceOffset)/2, 0, 2*Math.PI)  
        // context.stroke();

        // Once the moon is drawn then draw the overlays
        drawAll(time);
        printAll(time);

        initComplete = true;

        // time = time+timeStep;
        // if (time < 29.5*minPerDay) {
        //     //setTimeout(drawMoon(), 1)
        //     drawMoon();
        // }
    // }
}

function initSim() {

    canvas = document.querySelector('#simCanvas'); // canvas is intentionally global
    context = canvas.getContext('2d'); // context is intentionally global
    canvas.width = desiredCanvasWidth + 2*orbitDistanceOffset
    canvas.height = desiredCanvasWidth + 2*orbitDistanceOffset;     
    originX = canvas.width/2; // intentionall global
    originY = canvas.height/2; // intentionally global

    drawMoon();
    printAll();  
    printSimControl();
}

function stepSim() {
    time = time+timeStep;
    // updateModel();
    updateDisplay();
}

function runSim() {
    stepSim();
    if ((time > 29.5*minPerDay) || (simState != "run")) {
        clearInterval(simRun);
    }
}
function startSim() {
    simState = "run"
    simRun = setInterval(runSim, 50);
}
function pauseSim() {
    simState = "pause"
}


function drawOrbit(sunAngle) {
    
    sunAngle = (sunAngle+90) * (Math.PI/180)
    context.strokeStyle = "black";
    context.lineWidth = 5.0;
    context.beginPath();
    context.ellipse(originX, originY, orbitWidth/2, canvas.height/2, sunAngle, orbitVisibilityLowerBound*(Math.PI/180), orbitVisibilityUpperBound*(Math.PI/180));
    context.stroke();
    context.strokeStyle = "yellow";
    context.lineWidth = 3.0;
    context.beginPath();
    context.ellipse(originX, originY, orbitWidth/2, canvas.height/2, sunAngle, orbitVisibilityLowerBound*(Math.PI/180), orbitVisibilityUpperBound*(Math.PI/180));
    context.stroke();

}


function drawSunIllumination (sunAngle) {
    var rad = (sunAngle)*(Math.PI / 180.0)
    
    context.beginPath();
    context.arc(originX, originY, canvas.width/2, 0+rad, Math.PI+rad);
    context.closePath();
    context.lineWidth = 1;
    context.fillStyle = "rgba(0,0,0,"+shadowTransparency+")";
    context.fill();

}

function drawSatellite(deg, id, orbitAngle) {
    deg = (deg + 90)%360; // rotate so 0 degrees is the top of screen then CCW degrees around the orbit
    if (deg >= orbitVisibilityLowerBound && deg <= orbitVisibilityUpperBound) {    
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
        // context.fillRect(x+9, y-1, satelliteCrossWidth+2, satelliteCrossHeight+2);
        // context.fillRect(x-1, y+9, satelliteCrossHeight+2, satelliteCrossWidth+2);   
        context.fillRect(x-satelliteCrossWidth/2-1, y-satelliteCrossHeight/2-1, satelliteCrossWidth+2, satelliteCrossHeight+2);
        context.fillRect(x-satelliteCrossHeight/2-1, y-satelliteCrossWidth/2-1, satelliteCrossHeight+2, satelliteCrossWidth+2);    
        context.fillStyle = "blue";
        context.fillRect(x-satelliteCrossWidth/2, y-satelliteCrossHeight/2, satelliteCrossWidth, satelliteCrossHeight);
        context.fillRect(x-satelliteCrossHeight/2, y-satelliteCrossWidth/2, satelliteCrossHeight, satelliteCrossWidth);
        context.font = "16px Arial";
        context.fillStyle = "white";

        context.translate(x,y);
        context.rotate(-orbitAngle);
        context.translate(-x,-y)
        context.fillText(id, x-5, y+5);

        context.restore();
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
    context.font = "16px Arial";
    context.fillStyle = "black";
    context.fillText(id, x-5, y+5);
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

        // console.log("xDelta: ", customerX - customerX1);
        // console.log("yDelta: ", customerY - customerY1);
        // customerX = customerX*Math.cos(orbitAngle); // account for orbit angle in in canvas rotations
        // customerY = customerY*Math.sin(orbitAngle);// account for orbit angle in in canvas rotations

        //satDeg = satDeg + 90; // rotate so 0 degrees is the top of screen then CCW degrees around the orbit
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
        context.strokeStyle = "purple";
        context.lineWidth = 3.0;
        context.beginPath();
        context.moveTo(satX, satY);
        context.lineTo(customerX, customerY);
        context.stroke();
    
        context.restore();
    }
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function printAll() {
    printSatellites();
    printCustomers();
    printSimData();
}

function printSatellites() {
    var top = document.getElementById('top');
    top.replaceChildren()
    for (i=0;i<4;i++) {
        top.appendChild(printSatellite(i));
    }
    // top.appendChild(document.createElement('div').appendChild(document.createTextNode("&nbsp;")));
}

function printSatellite(id) {
    var satellite = document.createElement('div');
    if (id % 2) {
        satellite.className = "satellite notinview";
    }
    else {
        satellite.className = "satellite inview";
    }
    var header =  document.createElement('div');
    header.appendChild(document.createTextNode('Satellite: '+id));
    header.className = "left"
    satellite.appendChild(header);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Orbit:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('120/148'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('min'));
    unit.className = "unit right";

    satellite.appendChild(unit);
    satellite.appendChild(measurement);
    satellite.appendChild(label);
    
    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Solar Array:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('80'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('m2'));
    unit.className = "unit right";

    satellite.appendChild(unit);
    satellite.appendChild(measurement);
    satellite.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('EPS Efficiency:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('50'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode("%"));
    unit.className = "unit right";
    satellite.appendChild(unit);
    satellite.appendChild(measurement);
    satellite.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Battery:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('40% 4.0/5.0'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('kWhr'));
    unit.className = "unit right";
    satellite.appendChild(unit);
    satellite.appendChild(measurement);
    satellite.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Vehicle Pwr Draw:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('10.0'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('kW'));
    unit.className = "unit right";
    satellite.appendChild(unit);
    satellite.appendChild(measurement);
    satellite.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Laser Pwr Draw:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('20.0'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('kW'));
    unit.className = "unit right";
    satellite.appendChild(unit);
    satellite.appendChild(measurement);
    satellite.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Laser Pwr Output:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('(20%) 4.0'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('kW'));
    unit.className = "unit right";
    satellite.appendChild(unit);
    satellite.appendChild(measurement);
    satellite.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Lasers:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('(1)   (2)'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('(3)   (4)'));
    unit.className = "unit right";
    satellite.appendChild(unit);
    satellite.appendChild(measurement);
    satellite.appendChild(label);
    return satellite;
}

function printCustomers() {
    var bottom = document.getElementById('bottom');
    bottom.replaceChildren(); // start with empty div
    for (i=0;i<8;i++) {
        // if (i % 2) {
        //     var right = document.getElementById('right2');
        // }
        // else {
        //     var right = document.getElementById('right1');
        // }
        bottom.appendChild(printCustomer(i));
    }
    // bottom.appendChild(document.createElement('div').appendChild(document.createTextNode("&nbsp;")));

}

function printCustomer(id) {
    var customer = document.createElement('div');
    if (id % 2) {
        customer.className = "customer inshadow";
    }
    else {
        customer.className = "customer notinshadow";
    }
    var header =  document.createElement('div');
    header.appendChild(document.createTextNode('Customer: '+id));
    header.className = "left";
    customer.appendChild(header);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Location:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('88/40'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('lat/lng'));
    unit.className = "unit right";

    customer.appendChild(unit);
    customer.appendChild(measurement);
    customer.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Solar Array:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('1.2'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('m2'));
    unit.className = "unit right";

    customer.appendChild(unit);
    customer.appendChild(measurement);
    customer.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('EPS Efficiency:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('50'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('%'));
    unit.className = "unit right";
    customer.appendChild(unit);
    customer.appendChild(measurement);
    customer.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Battery:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('40% 4.0/5.0'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('kWhr'));
    unit.className = "unit right";
    customer.appendChild(unit);
    customer.appendChild(measurement);
    customer.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Beam 1:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('1000 km'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('1.7 m2'));
    unit.className = "unit right";
    customer.appendChild(unit);
    customer.appendChild(measurement);
    customer.appendChild(label);



    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Beam 2:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('1000 km'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('1.7 m2'));
    unit.className = "unit right";
    customer.appendChild(unit);
    customer.appendChild(measurement);
    customer.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Beam 3:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('1000 km'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('1.7 m2'));
    unit.className = "unit right";
    customer.appendChild(unit);
    customer.appendChild(measurement);
    customer.appendChild(label);
    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Beam 4:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('1000 km'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('1.7 m2'));
    unit.className = "unit right";
    customer.appendChild(unit);
    customer.appendChild(measurement);
    customer.appendChild(label);
    var unit2 =  document.createElement('div');
    unit2.appendChild(document.createTextNode('2.0 W/m2'));
    unit2.className = "unit right";
    customer.appendChild(unit2);    
    customer.appendChild(unit);
    customer.appendChild(measurement);
    customer.appendChild(label);

    return customer;
}


function printSimControl() {
    simLeft = document.getElementById('simLeft');
    simLeft.replaceChildren();
    var simControl = document.createElement('div')
    simControl.className = "simControl";

    var a = document.createElement('a')
    a.href = "javascript:startSim();"
    a.appendChild(document.createTextNode(">"));
    simControl.appendChild(a);

    var a = document.createElement('a')
    a.href = "javascript:pauseSim();"
    a.appendChild(document.createTextNode("||"));
    simControl.appendChild(a);

    var a = document.createElement('a')
    a.href = "javascript:stepSim();"
    a.appendChild(document.createTextNode(">|"));
    simControl.appendChild(a);

    simLeft.appendChild(simControl);
}

function printSimData() { 

    simRight = document.getElementById('simRight');
    simRight.replaceChildren();
    
    simRight.appendChild(document.createElement('div').appendChild(document.createTextNode(`Days: ${Math.floor(time/(24*60))}`)))
    simRight.appendChild(document.createElement('div').appendChild(document.createTextNode(` Hours: ${Math.floor((time/(60))%24)}`)))
    simRight.appendChild(document.createElement('div').appendChild(document.createTextNode(` Minutes: ${(time%60).toFixed(0)}`)))


    simRight.appendChild(document.createElement('div').appendChild(document.createTextNode(`Elapsed Minutes: ${time.toFixed(0)}`)))
}
