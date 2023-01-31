// Model parameters
const minPerDay = 60*24; // minutes per day
const daysPerLunarCycle = 29.5; // days per lunar cycle with respect to sun
const minPerLunarCycle = daysPerLunarCycle*minPerDay;

// Global simulation control parameters
var time = 0 // minuites
var refreshPeriod = 10 // 10msec (100Hz)
var timeStep = 1; // min/refresh
var simState = "pause";
var previousStartTime = Date.now();
var elapsedTime = 0; // msec
var prevAvgElapsedTime = 10; // msec
var avgElapsedTime = 10; // msec
var execRate = 100; // Hz
var frameCount = 0;


function initSim() {
    // Stop running if running
    if (simState == "run") {
        clearInterval(simRun);
    }

    // TODO: load configuration from config file
    lunarSpark = lunarSparkInput;

    // Reset globals to initial state
    time = 0 // minuites
    refreshPeriod = 10 // 10msec (100Hz)
    timeStep = 1; // min/refresh
    simState = "pause";
    previousStartTime = Date.now();
    elapsedTime = 0; // msec
    prevAvgElapsedTime = 10; // msec
    avgElapsedTime = 10; // msec
    execRate = 100; // Hz
    frameCount = 0;

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
    document.getElementById('runButton').className = "buttonDisabled"
    var startTime =  Date.now();
    elapsedTime = startTime - previousStartTime; // msec
    avgElapsedTime = (prevAvgElapsedTime*99 + elapsedTime)/100; // moving average over 100 samples - 1 sec
    execRate = (1000/(avgElapsedTime)); // Hz
    previousStartTime = startTime;
    prevAvgElapsedTime = avgElapsedTime;
    stepSim();
    if ((time >= minPerLunarCycle) || (simState != "run")) {
        clearInterval(simRun);
        document.getElementById('runButton').className = "button"
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
    timeStep = timeStep*2;
    printSimData();
}
function slower() {
    timeStep = timeStep/2;
    printSimData();
}

function printButton(label, action, id) {
    var a = document.createElement('a')
    a.href = action; 
    a.className = "button";
    a.id = id;
    a.appendChild(document.createTextNode(label));
    return a    
}
function printSimControl() {

    var simControl = document.createElement('div')
    simControl.id = "simControl";

    simControl.appendChild(printButton("\u2699", "javascript:initSim();", "configButton")); // TODO: Add load configuration
    simControl.appendChild(printButton("\u25B6","javascript:startSim();", "runButton"));
    simControl.appendChild(printButton("\u23FD\u23FD", "javascript:pauseSim();", "pauseButton"));
    simControl.appendChild(printButton("\u20D5", "javascript:stepSim();", "stepButton"));
    simControl.appendChild(printButton("\u21CA", "javascript:slower();", "slowerButton"));    
    simControl.appendChild(printButton("\u21C8", "javascript:faster();", "fasterButton"));
    simControl.appendChild(printButton("\u21BA", "javascript:initSim();", "recycleButton"));
    simLeft.replaceChildren(simControl)

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
function printRow(a, b, c) {
    var label =  document.createElement('div');
    label.appendChild(document.createTextNode(a));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode(b));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode(c));
    unit.className = "unit right";

    var row = document.createElement('div')
    row.appendChild(unit);
    row.appendChild(measurement);
    row.appendChild(label);

    return row
}
function printTable (a,b,c,d,e) {
    var label =  document.createElement('div');
    label.appendChild(document.createTextNode(" "+a));
    label.className = "table-left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode(" "+b));
    measurement.className = "table-right";
    var measurement2 =  document.createElement('div');
    measurement2.appendChild(document.createTextNode(" "+c));
    measurement2.className = "table-right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode(" "+d));
    unit.className = "table-right";
    var unit2 =  document.createElement('div');
    unit2.appendChild(document.createTextNode(" "+e));
    unit2.className = "table-right";

    var row = document.createElement('div')
    row.appendChild(unit2);
    row.appendChild(unit);
    row.appendChild(measurement2);
    row.appendChild(measurement);
    row.appendChild(label);

    return row
}

function printSatellite(id) {
    var satellite = document.createElement('div');
    if (id % 2) {
        satellite.className = "satellite notinview";
    }
    else {
        satellite.className = "satellite inview";
    }

    satellite.appendChild(printRow("Sattelite["+id+"]:", "VIPER", "-"));

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode('Orbit:'));
    label.className = "left";
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode('#8999 120/148'));
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
    measurement.appendChild(document.createTextNode('(1)(2)'));
    measurement.className = "right";
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode('(3)(4)'));
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
        bottom.appendChild(printCustomer(i));
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

    customer.appendChild(printRow("Customer["+id+"]:", "VIPER", "-"));
    customer.appendChild(printRow("Location (lat/long):", "88/80", "deg"));
    customer.appendChild(printRow("Solar Array (1.0m x 2.0m)", "2.0", "m2"));
    customer.appendChild(printRow("EPS Efficiency:", "50", "%"));
    customer.appendChild(printRow("Battery Capacity:", "50% 4.0/5.0", "kWhr"));
    customer.appendChild(printTable("Beam", "Range", "Diameter", "Intensity", "Power"));
    customer.appendChild(printTable("#", "km", "m", "W/m2", "W"));
    customer.appendChild(printRow("Beam", "Rng(km) Diam(m) Intsty(W/m2)", "Pwr(W)"));
    customer.appendChild(printRow("Beam 1:", "1000 km 1.2", "m2"));
    customer.appendChild(printRow("Beam 1:", "1000 km 1.2", "m2"));
    customer.appendChild(printRow("Beam 1:", "1000 km 1.2", "W/m2"));

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
    label.appendChild(document.createTextNode('Step Duration:'));
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
    measurement.appendChild(document.createTextNode(execRate.toFixed(0)));
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
