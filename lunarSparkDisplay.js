// Model parameters
const minPerDay = 60*24; // minutes per day
const daysPerLunarCycle = 29.5; // days per lunar cycle with respect to sun
const minPerLunarCycle = daysPerLunarCycle*minPerDay;

// Global simulation control parameters
var time = 0 // minuites
var refreshPeriod = 10 // 10msec (100Hz)
var timeStep = 1; // min/refresh
var simState = "pause";
var previousStartTime = 0;
var elapsedTime = 0; // msec
var prevAvgElapsedTime = 10; // msec
var avgElapsedTime = 10; // msec
var execRate = 100; // Hz
var frameCount = 0;

// Display thresholds
const battRedThreshold = 0 // %
const battOrangeThreshold = 10 // %


const maxLasersPerSatellite = 4;
const maxBeamsPerVehicle = 4;

function initSim() {
    // Stop running if running
    if (simState == "run") {
        clearInterval(simRun);
    }

    // Set initial values from input configuration file
    lunarSpark =  JSON.parse(localStorage.getItem("lunarSparkInput"));

    // Reset globals to initial state
    time = 0 // minuites
    refreshPeriod = 10 // 10msec (100Hz)
    timeStep = 1; // min/refresh
    simState = "pause";
    previousStartTime = 0;
    elapsedTime = 0; // msec
    prevAvgElapsedTime = 10; // msec
    avgElapsedTime = 10; // msec
    execRate = 100; // Hz
    frameCount = 0;
    disconnectAllLasers();

    canvas = document.querySelector('#simCanvas'); // canvas is intentionally global
    context = canvas.getContext('2d'); // context is intentionally global
    canvas.width = desiredCanvasWidth + 2*orbitDistanceOffset
    canvas.height = desiredCanvasWidth + 2*orbitDistanceOffset;     
    originX = canvas.width/2; // intentionall global
    originY = canvas.height/2; // intentionally global

    printSimControl();
    drawMoon();
    drawAll();
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
    if (previousStartTime == 0) {
        elapsedTime = 10; // set initial elapsed time 
    }
    else {
        elapsedTime = startTime - previousStartTime; // msec
    }
    avgElapsedTime = (prevAvgElapsedTime*99 + elapsedTime)/100; // moving average over 100 samples - 1 sec
    execRate = (1000/(avgElapsedTime)); // Hz
    previousStartTime = startTime;
    prevAvgElapsedTime = avgElapsedTime;
    stepSim();
    if ((time >= minPerLunarCycle) || (simState != "run")) {
        clearInterval(simRun);
        document.getElementById('runButton').className = "button";
        previousStartTime = 0; // reset start time for exec rate
        printAll(); // ensure final step data has been printed to display
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
    
    document.getElementById("simControl").replaceWith(simControl);

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
    printVehicles();
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
    for (i=0;i<maxLasersPerSatellite;i++) {
        top.appendChild(printSatellite(i));
    }
}
function printSatellite(index) {
    var sat = lunarSpark.satellites[index]
    var satellite = document.createElement('div');

    if (sat.active) {
        if (index % 2) {
            satellite.className = "satellite notinview";
        }
        else {
            satellite.className = "satellite inview";
        }

        satellite.appendChild(printRow("Satellite["+index+"]:", sat.id, "-", true));
        satellite.appendChild(printRow("Orbit(time/period):", sat.orbit.min.toFixed(0)+"/"+lunarSpark.environment.orbit.period, "min"));
        satellite.appendChild(printRow("Solar Panel Pwr Output:", sat.solar_panel.power_output.toFixed(2), "kW"));
        var row = printRow("Battery Charge:", sat.battery.percent.toFixed(1)+"% "+ sat.battery.charge.toFixed(2)+"/"+sat.battery.capacity.toFixed(2), "kWh");
        if (sat.battery.percent <= battOrangeThreshold) {
            row.className = "orange";
        }
        if (sat.battery.percent <= battRedThreshold) {
            row.className = "red";
        }
        satellite.appendChild(row);    
        //satellite.appendChild(printRow("Battery Charge:", (sat.battery.charge/sat.battery.capacity*100).toFixed(0)+"% "+ sat.battery.charge.toFixed(2)+"/"+sat.battery.capacity.toFixed(2), "kWh"));
        
        satellite.appendChild(printRow("Satellite Pwr Draw:", sat.veh_power_draw.toFixed(2), "kW"));

        satellite.appendChild(printRow("Laser Pwr Draw:", sat.laser_power_draw.toFixed(2), "kW")); 
        satellite.appendChild(printRow("Laser Pwr Output:", (sat.laser_power_draw*0.2).toFixed(2),"kW")); // TODO: fix hardcoded eff 20%

        satellite.appendChild(printTable("Veh", "Rng(km)", "Dia(m)", "(W/m2)", "Pwr(W)", true));
        for (var i=0;i<maxLasersPerSatellite;i++) {
            if (i<sat.lasers.length) {
                satellite.appendChild(printTable(sat.lasers[i].vehicle, sat.lasers[i].range.toFixed(2), sat.lasers[i].diameter.toFixed(2), sat.lasers[i].intensity.toFixed(0), sat.lasers[i].power.toFixed(0)));
            }
              else {
                satellite.appendChild(printTable("---", "---", "---", "---", "---")); 
            }
        }
    }
    else {
        satellite.className = "satellite inactive";
        satellite.appendChild(printRow("Satellite["+index+"]:", "---", "-", true));
        satellite.appendChild(printRow("Orbit(time/period):", "---", "-"));
        satellite.appendChild(printRow("Solar Panel Pwr Output:", "---", "-"));
        satellite.appendChild(printRow("Battery Charge:", "---", "-"));
        satellite.appendChild(printRow("Satellite Pwr Draw:", "---", "-"));
        satellite.appendChild(printRow("Laser Pwr Draw:", "---", "-")); 
        satellite.appendChild(printRow("Laser Pwr Output:", "---", "-")); // TODO: fix hardcoded eff 20%
        satellite.appendChild(printTable("Veh", "Rng(km)", "Dia(m)", "(W/m2)", "Pwr(W)", true));
        for (var i=0;i<maxLasersPerSatellite;i++) {
            satellite.appendChild(printTable("---", "---", "---", "---", "---")); 
        }

    }
    return satellite;
}

function printVehicles() {
    var left = document.createElement('div');
    left.id = "vehLeft";
    for (i=0;i<lunarSpark.vehicles.length/2;i++) {
        left.appendChild(printVehicle(i));
    }
    document.getElementById("vehLeft").replaceWith(left);

    var right = document.createElement('div');
    right.id = "vehRight";
    for (i=lunarSpark.vehicles.length/2;i<lunarSpark.vehicles.length;i++) {
        right.appendChild(printVehicle(i));
    }
    document.getElementById("vehRight").replaceWith(right);
}

function printVehicle(index) {
    var veh = lunarSpark.vehicles[index];
    var vehicle = document.createElement('div');
    if (veh.active) {
        if (veh.location.in_night) {
            vehicle.className = "vehicle inshadow";
        }
        else {
            vehicle.className = "vehicle notinshadow";
        }

        vehicle.appendChild(printRow("Vehicle["+index+"]:", veh.id, "-", true));
        vehicle.appendChild(printRow("Location (lat/long):", veh.location.lat+"/"+veh.location.long, "deg"));
        vehicle.appendChild(printRow("Solar Panel Pwr Output:", veh.solar_panel.power_output.toFixed(2), "kW"));
        var row = printRow("Battery Charge:", veh.battery.percent.toFixed(1)+"% "+ veh.battery.charge.toFixed(2)+"/"+veh.battery.capacity.toFixed(2), "kWh");
        if (veh.battery.percent <= battOrangeThreshold) {
            row.className = "orange";
        }
        if (veh.battery.percent <= battRedThreshold) {
            row.className = "red";
        }
        vehicle.appendChild(row);
        
        vehicle.appendChild(printRow("Laser Panel Pwr Output:", (veh.laser_panel.power_output).toFixed(2), "kW"));
        vehicle.appendChild(printTable("Laser", "Rng(km)", "Dia(m)", "(W/m2)", "Pwr(W)", true));
        for (var i=0;i<maxBeamsPerVehicle;i++) {
            if (i<veh.beams.length) {
                vehicle.appendChild(printTable(veh.beams[i].satellite+"."+veh.beams[i].laser, veh.beams[i].range.toFixed(2), veh.beams[i].diameter.toFixed(2), veh.beams[i].intensity.toFixed(0), veh.beams[i].power.toFixed(0))); 
            }
            else {
                vehicle.appendChild(printTable("-.-", "---", "---", "---", "---")); 
            }
        }
    }
    else {
        vehicle.className = "vehicle inactive";
        vehicle.appendChild(printRow("Vehicle["+index+"]:", "---", "-", true));
        vehicle.appendChild(printRow("Location (lat/long):", "---", "-"));
        vehicle.appendChild(printRow("Solar Panel Pwr Output:", "---", "-"));
        vehicle.appendChild(printRow("Battery Charge:", "--- ---/---", "-"));
        vehicle.appendChild(printRow("Laser Panel Pwr Output:", "---", "-"));
        vehicle.appendChild(printTable("Laser", "Rng(km)", "Dia(m)", "(W/m2)", "Pwr(W)", true));
        for (var i=0;i<maxBeamsPerVehicle;i++) {
            vehicle.appendChild(printTable("-.-", "---", "---", "---", "---")); 
        }
    }

    return vehicle;
}

function printSimData() { 
    printSimStatus(); 
}

function printSimStatus() {
    // Left sim status
    var div = document.createElement('div');
    div.id = "simStatus1";

    div.appendChild(printRow("Step Duration:", timeStep.toFixed(3), "min"));
    div.appendChild(printRow("Exec Rate:", execRate.toFixed(1), "Hz"));
    
    simStatus = document.getElementById('simStatus1');
    simStatus.replaceWith(div);

    // Right sim status
    var div = document.createElement('div');
    div.id = "simStatus2";

    div.appendChild(printRow("Elapsed Time:", time.toFixed(0), "min"));
    div.appendChild(printRow("Days:", Math.floor(time/(24*60)), "days"));
    div.appendChild(printRow("Hrs:", Math.floor(time/60)%24, "hrs"));
    div.appendChild(printRow("Min:", (time%60).toFixed(0), "min"));
    div.appendChild(printRow("Orbit Count:", (lunarSpark.environment.orbit.count), "-"));
    div.appendChild(printRow("Sun Angle:", (lunarSpark.environment.sun_angle).toFixed(2), "deg"));

    simRight = document.getElementById('simStatus2');
    simRight.replaceWith(div);

}
