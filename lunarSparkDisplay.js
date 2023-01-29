// Model parameters
const minPerDay = 60*24; // minutes per day
const daysPerLunarCycle = 29.5; // days per lunar cycle with respect to sun
const minPerLunarCycle = daysPerLunarCycle*minPerDay;
var time = 0 // minuites
var refreshPeriod = 10 // 10msec (100Hz) 50 msec (20Hz), 100 msec (10Hz);
var timeStep = 1; // min/refresh
var simState = "pause";
var previousStartTime = Date.now();
var elapsedTime = 0; // msec
var execRate = 0; // Hz
var frameCount = 0;


function initSim() {

    canvas = document.querySelector('#simCanvas'); // canvas is intentionally global
    context = canvas.getContext('2d'); // context is intentionally global
    canvas.width = desiredCanvasWidth + 2*orbitDistanceOffset
    canvas.height = desiredCanvasWidth + 2*orbitDistanceOffset;     
    originX = canvas.width/2; // intentionall global
    originY = canvas.height/2; // intentionally global

    printSimControl();
    drawMoon();
    printAll();  
}

function stepSim() {
    time = time+timeStep;
    stepModel();
    updateDisplay();
}

function runSim() {
    document.getElementById('runButton').style.visibility = "hidden";
    var startTime =  Date.now();
    elapsedTime = startTime - previousStartTime; // msec
    execRate = (1/(elapsedTime*1000)).toFixed(2); // Hz
    previousStartTime = startTime;
    stepSim();
    if ((time >= minPerLunarCycle) || (simState != "run")) {
        clearInterval(simRun);
        document.getElementById('runButton').style.visibility = "visible";
    }
}
function startSim() {
    simState = "run"
    simRun = setInterval(runSim, refreshPeriod);
}
function pauseSim() {
    simState = "pause"
}

function faster() {
    // if (refreshPeriod > 1) {
    //     refreshPeriod = refreshPeriod/10;
    //     clearInterval(simRun);
    //     startSim();
    // }
    // else {
    //     timeStep = timeStep+1
    // }
    timeStep = timeStep*2;
    printSimData();
}
function slower() {
    // if (timeStep > 1) {
    //     timeStep = timeStep-1
    // } 
    // else {    
    //     refreshPeriod = refreshPeriod * 10;
    //     clearInterval(simRun);
    //     startSim();
    // }
    timeStep = timeStep/2;
    printSimData();
}

function printSimControl() {

    var simControl = document.createElement('div')
    simControl.id = "simControl";

    var a = document.createElement('a')
    a.href = "javascript:startSim();"
    a.id = "runButton";
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

    simLeft = document.getElementById('simLeft');
    simLeft.replaceChildren(simControl);

    var simStatus = document.createElement('div');
    simStatus.id = "simStatus";

    simLeft.appendChild(simStatus)
}

function updateDisplay() {
    clearCanvas();
    drawAll(time);
    // if stepping or every 0.5 second 
    if (simState != "run" || (frameCount%(500/refreshPeriod))==0) {
        printAll(time);
    }
    frameCount = frameCount+1;
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
    printSimLeft(); 
    printSimRight();
}

function printSimLeft() {
    var div = document.createElement('div');
    div.id = "simStatus";

    // var label =  document.createElement('div');
    // label.appendChild(document.createTextNode('Step Period:'));
    // label.className = "left";
    // var measurement =  document.createElement('div');
    // measurement.appendChild(document.createTextNode(refreshPeriod));
    // measurement.className = "right";
    // var unit =  document.createElement('div');
    // unit.appendChild(document.createTextNode('msec'));
    // unit.className = "unit right";
    // div.appendChild(unit);
    // div.appendChild(measurement);
    // div.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Min / Step:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode(timeStep));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('min'));
    unit.className = "unit right";
    div.appendChild(unit);
    div.appendChild(measurement);
    div.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Exec Rate:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode((1000/elapsedTime).toFixed(0)));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('Hz'));
    unit.className = "unit right";
    div.appendChild(unit);
    div.appendChild(measurement);
    div.appendChild(label);   
    
    simStatus = document.getElementById('simStatus');
    simStatus.replaceWith(div);

}

function printSimRight() {
    simRight = document.getElementById('simRight');
    simRight.replaceChildren();
 
    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Elapsed Time:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode((time).toFixed(0)));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('min'));
    unit.className = "unit right";
    simRight.appendChild(unit);
    simRight.appendChild(measurement);
    simRight.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Days:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode(Math.floor(time/(24*60))));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('days'));
    unit.className = "unit right";
    simRight.appendChild(unit);
    simRight.appendChild(measurement);
    simRight.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Hours:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode(Math.floor(time/(60))%24));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('hrs'));
    unit.className = "unit right";
    simRight.appendChild(unit);
    simRight.appendChild(measurement);
    simRight.appendChild(label);

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Minutes:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode((time%60).toFixed(0)));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('min'));
    unit.className = "unit right";
    simRight.appendChild(unit);
    simRight.appendChild(measurement);
    simRight.appendChild(label);

}
