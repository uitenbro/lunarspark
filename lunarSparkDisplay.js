


// Model parameters
const minPerDay = 60*24; // minutes per day
var time = 0 // minuites
const refreshRate = 100 // 50 msec (20Hz), 100 msec (10Hz);
var timeStep = 1; // min/refresh
var simState = "pause"


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
    if ((time >= 29.5*minPerDay) || (simState != "run")) {
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

function faster() {
    timeStep = timeStep+1
    stepRate = document.getElementById('stepRate');
    stepRate.innerHTML = timeStep;
}
function slower() {
    if (timeStep > 1) {
        timeStep = timeStep-1
    }
    stepRate = document.getElementById('stepRate');
    stepRate.innerHTML = timeStep;
}

function printSimControl() {
    simLeft = document.getElementById('simLeft');
    simLeft.replaceChildren();
    var simControl = document.createElement('div')
    simControl.id = "simControl";

    var a = document.createElement('a')
    a.href = "javascript:startSim();"
    a.appendChild(document.createTextNode(">>"));
    simControl.appendChild(a);

    var a = document.createElement('a')
    a.href = "javascript:pauseSim();"
    a.appendChild(document.createTextNode("||"));
    simControl.appendChild(a);

    var a = document.createElement('a')
    a.href = "javascript:stepSim();"
    a.appendChild(document.createTextNode(">|"));
    simControl.appendChild(a);

    var a = document.createElement('a')
    a.href = "javascript:slower();"
    a.appendChild(document.createTextNode("--"));
    simControl.appendChild(a);

    var a = document.createElement('a')
    a.href = "javascript:faster();"
    a.appendChild(document.createTextNode("++"));
    simControl.appendChild(a);

    var a = document.createElement('a')
    a.id = "stepRate"
    a.appendChild(document.createTextNode(timeStep));
    simControl.appendChild(a);

    simLeft.appendChild(simControl);
}

function updateDisplay() {
    clearCanvas();
    drawAll(time);
    printAll(time);
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

function printSimData() { 

    simRight = document.getElementById('simRight');
    simRight.replaceChildren();
    
    simRight.appendChild(document.createElement('div').appendChild(document.createTextNode(`Days: ${Math.floor(time/(24*60))}`)))
    simRight.appendChild(document.createElement('div').appendChild(document.createTextNode(` Hours: ${Math.floor((time/(60))%24)}`)))
    simRight.appendChild(document.createElement('div').appendChild(document.createTextNode(` Minutes: ${(time%60).toFixed(0)}`)))


    simRight.appendChild(document.createElement('div').appendChild(document.createTextNode(` Elapsed Minutes: ${time.toFixed(0)}`)))
}
