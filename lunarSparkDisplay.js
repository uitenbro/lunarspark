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


function printRow(a, b, c, header=false) {
    var underline = "";
    if (header) {
        underline = " underline";
    }

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode(a));
    label.className = "left"+underline;
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode(b));
    measurement.className = "right"+underline;
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode(c));
    unit.className = "unit right"+underline;

    var row = document.createElement('div')
    row.appendChild(unit);
    row.appendChild(measurement);
    row.appendChild(label);

    return row
}
function printTable (a,b,c,d,e, header=false) {
    var underline = "";
    if (header) {
        underline = " underline";
    }

    var label =  document.createElement('div');
    label.appendChild(document.createTextNode(" "+a));
    label.className = "table-left"+underline;
    var measurement =  document.createElement('div');
    measurement.appendChild(document.createTextNode(" "+b));
    measurement.className = "table-right"+underline;
    var measurement2 =  document.createElement('div');
    measurement2.appendChild(document.createTextNode(" "+c));
    measurement2.className = "table-right"+underline;
    var unit =  document.createElement('div');
    unit.appendChild(document.createTextNode(" "+d));
    unit.className = "table-right"+underline;
    var unit2 =  document.createElement('div');
    unit2.appendChild(document.createTextNode(" "+e));
    unit2.className = "table-right"+underline;

    var row = document.createElement('div')
    row.appendChild(unit2);
    row.appendChild(unit);
    row.appendChild(measurement2);
    row.appendChild(measurement);
    row.appendChild(label);

    return row
}
function printSatellites() {
    var top = document.getElementById('top');
    top.replaceChildren()
    for (i=0;i<4;i++) {
        top.appendChild(printSatellite(i));
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

    satellite.appendChild(printRow("Sattelite["+id+"]:", "VIPER", "-", true));
    satellite.appendChild(printRow("Orbit(num min):", "89999 124/148", "min"));
    satellite.appendChild(printRow("Solar Array:", "80.0", "m2"));
    satellite.appendChild(printRow("EPS Efficiency:", "50%", "-"));
    satellite.appendChild(printRow("Battery Charge:", "(20%) 4.0/5.0", "kWhr"));
    satellite.appendChild(printRow("Vehicle Pwr Draw", "10.0", "kW"));
    satellite.appendChild(printRow("Laser Pwr Draw:", "4.0", "kW"));
    satellite.appendChild(printRow("Laser Pwr Output:", "(20%) 4.0", "kW"));

    satellite.appendChild(printTable("Cus", "Rng(km)", "Dia(m)", "(W/m2)", "Pwr(W)", true));
    satellite.appendChild(printTable("1", "1000", "1.2", "2.1", "1.0"));
    satellite.appendChild(printTable("2", "1000", "1.2", "2.1", "1.0"));
    satellite.appendChild(printTable("3", "1000", "1.2", "2.1", "1.0"));
    satellite.appendChild(printTable("4", "1000", "1.2", "2.1", "1.0"));
   
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

    customer.appendChild(printRow("Customer["+id+"]:", "VIPER", "-", true));
    customer.appendChild(printRow("Location (lat/long):", "88/80", "deg"));
    customer.appendChild(printRow("Solar Array: (1.0m x 2.0m)", "2.0", "m2"));
    customer.appendChild(printRow("EPS Efficiency:", "50%", "-"));
    customer.appendChild(printRow("Battery Charge:", "(50%) 2.5/5.0", "kWhr"));
    customer.appendChild(printRow("Laser Panel:", "(1.0x1.0) 1.0", "m2"));
    customer.appendChild(printTable("Sat", "Rng(km)", "Dia(m)", "(W/m2)", "Pwr(W)", true));
    customer.appendChild(printTable("1", "1000", "1.2", "2.1", "1.0"));
    customer.appendChild(printTable("2", "1000", "1.2", "2.1", "1.0"));
    customer.appendChild(printTable("3", "1000", "1.2", "2.1", "1.0"));
    customer.appendChild(printTable("4", "1000", "1.2", "2.1", "1.0"));

    return customer;
}

function printSimData() { 
    printSimLeft(); 
    printSimRight();
}

function printSimLeft() {
    var div = document.createElement('div');
    div.id = "simStatus";

    div.appendChild(printRow("Step Duration:", timeStep, "min"));
    div.appendChild(printRow("Exec Rate:", execRate.toFixed(0), "Hz"));
    
    simStatus = document.getElementById('simStatus');
    simStatus.replaceWith(div);

}

function printSimRight() {
    simRight = document.getElementById('simRight');
    simRight.replaceChildren();
 
    simRight.appendChild(printRow("Elapsed Time:", time.toFixed(0), "min"));
    simRight.appendChild(printRow("Days:", Math.floor(time/(24*60)), "days"));
    simRight.appendChild(printRow("Hrs:", Math.floor(time/60)%24, "hrs"));
    simRight.appendChild(printRow("Min:", (time%60).toFixed(0), "min"));

}
