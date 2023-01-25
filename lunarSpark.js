// Background image and canvas dimensions
const desiredCanvasWidth = 540; // pixels
const orbitHeightOffset = 100; // pixels
const orbitWidth = 200; // pixels
//const imageFile = "labeled_lunar_south_pole.jpg"; // 80-90 degree south pole image with sites labeled
const imageFile = "elphic_south_lunar_pole_ice.png"; // 80-90 degree south pole image with ice sites colored
const minLatitude = 80; // minimum degrees of latitude in image
const shadowTransparency = 0.4 

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



function drawMoon() {

    const img = new Image(); // Create new img element
    img.src = imageFile; // Set source path
    img.onload = function() {

        // Setup global canvas coordinates based on image scaling
        imageScaleFactor = desiredCanvasWidth/img.width;
        canvas.width = img.width*imageScaleFactor
        canvas.height = img.height*imageScaleFactor + 2*orbitHeightOffset;
        originX = canvas.width/2; 
        originY = canvas.height/2;

        // Add moon image
        context.drawImage(img, 0, orbitHeightOffset, img.width*imageScaleFactor, img.height*imageScaleFactor)
    
        // Add outline to moon
        context.strokeStyle = "black";
        context.lineWidth = 2.0;
        context.beginPath();
        context.arc(originX, originY, canvas.width/2, 0, 2*Math.PI)  
        context.stroke();

        drawSunIllumination(75); 

        drawLaser(90, 0, 85, 30)  
        drawLaser(90, 1, 85, 30)  
        drawLaser(90, 2, 85, -60)  
        drawLaser(90, 3, 82, 15)  

        drawCustomer(85, 30, "1");
        drawCustomer(85, -60, "2");
        drawCustomer(90, 0, "3");
        drawCustomer(82, 15, "4");
        drawCustomer(84, 30, "5");
        drawCustomer(86, 45, "6");
        drawCustomer(88, -165, "7");
        drawCustomer(82, -90, "8");

        drawOrbit();
        drawSatellite(0, "0");
        drawSatellite(30, "1");
        drawSatellite(60, "2");
        drawSatellite(90, "3");
        drawSatellite(120, "4");
        drawSatellite(150, "5");
        drawSatellite(180, "6");
        drawSatellite(210, "7");

    }
}

function drawOrbit() {
    
    context.strokeStyle = "black";
    context.lineWidth = 5.0;
    context.beginPath();
    context.ellipse(originX, originY, orbitWidth/2, canvas.height/2, 0, (Math.PI/2), 3/2*Math.PI);
    context.stroke();
    context.strokeStyle = "yellow";
    context.lineWidth = 3.0;
    context.beginPath();
    context.ellipse(originX, originY, orbitWidth/2, canvas.height/2, 0, (Math.PI/2), 3/2*Math.PI);
    context.stroke();

}

function initSim() {

    canvas = document.querySelector('#simCanvas'); // canvas is intentionally global
    context = canvas.getContext('2d'); // context is intentionally global

    drawMoon();

    printSatellites();
    printCustomers();
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

function drawSatellite(deg, id) {
    if (deg >= 0 && deg <= 180) {    
        deg = deg + 90; // rotate so 0 degrees is the top of screen then CCW degrees around the orbit
        var a = orbitWidth/2;
        var b = canvas.height/2;
        var t = (deg)*(Math.PI / 180.0)
        var x = a*Math.cos(t); // pixels from central origin
        var y = b*Math.sin(t); // pixels from central origin
        x = originX+x; // pixels from canvas orgin
        y = originY-y; // pixels from canvas orgin

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
        context.fillText(id, x-5, y+5);
    }
}

function drawCustomer(lat, long, id) {
    var hyp = (90-lat)/(90-minLatitude) * canvas.width/2; // pixel length of hypotenuse
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

function drawLaser(satDeg, laserNum, lat, long) {
    var hyp = (90-lat)/(90-minLatitude) * canvas.width/2; // pixel length of hypotenuse
    var customerX = hyp*Math.sin(long * (Math.PI / 180.0)); // pixels from central origin
    var customerY = hyp*Math.cos(long * (Math.PI / 180.0)); // pixels from central origin
    customerX = originX+customerX; // pixels from canvas orgin
    customerY = originY-customerY; // pixels from canvas orgin

    satDeg = satDeg + 90; // rotate so 0 degrees is the top of screen then CCW degrees around the orbit
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

}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function printSatellites() {
    var left = document.getElementById('left');
    for (i=0;i<4;i++) {
        left.appendChild(printSatellite(i));
    }
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
    
    return satellite;
}

function printCustomers() {
    for (i=0;i<8;i++) {
        // if (i % 2) {
        //     var right = document.getElementById('right2');
        // }
        // else {
        //     var right = document.getElementById('right1');
        // }
        var right = document.getElementById('right');
        right.appendChild(printCustomer(i));
    }
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

    return customer;
}
