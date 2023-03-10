// Global simulation control parameters
var time = 0 // minuites
var refreshPeriod = 10 // 10msec (100Hz)
var timeStep = 1; // min/refresh
var savedTimeStep = timeStep;
var simState = "pause";
var previousStartTime = 0;
var elapsedTime = 0; // msec
var prevAvgElapsedTime = 10; // msec
var avgElapsedTime = 10; // msec
var execRate = 100; // Hz
var realTime = execRate * timeStep*60// step/sec * min/step
var frameCount = 0;

// Display thresholds
const battRedThreshold = 25 // %
const battOrangeThreshold = 50 // %


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
    savedTimeStep = timeStep;
    simState = "pause";
    previousStartTime = 0;
    elapsedTime = 0; // msec
    prevAvgElapsedTime = 10; // msec
    avgElapsedTime = 10; // msec
    execRate = 100; // Hz
    realTime = execRate * timeStep*60
    frameCount = 0;

    canvas = document.querySelector('#simCanvas'); // canvas is intentionally global
    context = canvas.getContext('2d'); // context is intentionally global
    canvas.width = desiredCanvasWidth + 2*orbitDistanceOffset
    canvas.height = desiredCanvasWidth + 2*orbitDistanceOffset;     
    originX = canvas.width/2; // intentionall global
    originY = canvas.height/2; // intentionally global


    // step sim with zero time to initialize all dervived parameters
    stepSim(0);
    disconnectAllLasers();

    // Draw initial screen
    printSimControl();
    drawMoon();
    drawAll();
    printAll();  
}

function stepSim(step) {

    // if a custom time step is commanded use it for this frame (use zero for initialization)
    if (step != undefined) {
        savedTimeStep = timeStep;
        timeStep = step;
    }
   
    time = time+timeStep;
    
    stepModel();
    
    // restore previous time step
    timeStep = savedTimeStep;

    updateDisplay();

}

function runSim() {
    document.getElementById('runButton').className = "buttonDisabled"
    var startTime =  Date.now();
    if (previousStartTime == 0) {
        elapsedTime = refreshPeriod; // set initial elapsed time to the refresh period
    }
    else {
        elapsedTime = startTime - previousStartTime; // msec
    }
    avgElapsedTime = (prevAvgElapsedTime*99 + elapsedTime)/100; // moving average over 100 samples - 1 sec
    execRate = (1000/(avgElapsedTime)); // Hz
    realTime = execRate * timeStep*60
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
    savedTimeStep = timeStep;
    realTime = execRate * timeStep*60
    printSimData();
}
function slower() {
    timeStep = timeStep/2;
    savedTimeStep = timeStep;
    realTime = execRate * timeStep*60
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
    // if stepping or every 0.20 second 
    if (simState != "run" || (frameCount%(200/refreshPeriod))==0) {
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
function printTable (a,b,c,d,e,f,g, header=false) {
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
    var unit3 =  document.createElement('div');
    unit3.appendChild(document.createTextNode(" "+f));
    unit3.className = "table-right"+underline;
    var unit4 =  document.createElement('div');
    unit4.appendChild(document.createTextNode(" "+g));
    unit4.className = "table-right"+underline;

    var row = document.createElement('div')
    row.appendChild(unit4);   
    row.appendChild(unit3);   
    row.appendChild(unit2);
    row.appendChild(unit);
    row.appendChild(measurement2);
    row.appendChild(measurement);
    row.appendChild(label);

    return row
}
function printBatteryGuage(batteryPecent) {
    var batteryGauge =  document.createElement('meter');
    batteryGauge.min = 0;
    batteryGauge.max = 100
    batteryGauge.high = battOrangeThreshold;
    batteryGauge.low = battRedThreshold;
    batteryGauge.optimum = 75;
    batteryGauge.value = batteryPecent;
    if (batteryPecent <= battRedThreshold) {
        batteryGauge.className = "red";
    }
    else if (batteryPecent <= battOrangeThreshold) {
        batteryGauge.className = "orange";
    }
    else {
        batteryGauge.className = "green";
    }


    return batteryGauge;
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
        // if (sat.orbit.anomaly >= orbitVisibilityLowerBound+satelliteVisibilityOffset && sat.orbit.anomaly <= orbitVisibilityUpperBound-satelliteVisibilityOffset) {
        //     satellite.className = "satellite notinview";
        // }
        // else {
            satellite.className = "satellite inview";
        // }

        // TODO: add orbit count, satLat, satLong, and range/az/elev to each customer
        
        satellite.appendChild(printRow("Satellite["+index+"]:", sat.id, "-", true));
        var row = printRow("Battery Charge:", sat.battery.percent.toFixed(1)+"% "+ sat.battery.charge.toFixed(0)+"/"+sat.battery.capacity.toFixed(0), "Wh");
        satellite.appendChild(row); 
        satellite.appendChild(printBatteryGuage(sat.battery.percent)); 
        satellite.appendChild(printRow("Satellite Pwr Draw:", sat.sat_power_draw.toFixed(0), "W"));
        satellite.appendChild(printRow("Orbit(anomaly):", sat.orbit.anomaly.toFixed(1), "deg"));
        satellite.appendChild(printRow("Orbit(time/period):", sat.orbit.min.toFixed(0)+"/"+lunarSpark.environment.orbit.period, "min"));
        satellite.appendChild(printRow("Sub-Satellite(lat/long):", sat.orbit.lat.toFixed(1)+"/"+sat.orbit.long.toFixed(1), "deg"));
        satellite.appendChild(printRow("Solar Panel Pwr Output:", sat.solar_panel.power_output.toFixed(0), "W"));        
        satellite.appendChild(printRow("Laser Pwr Draw:", sat.laser_power_draw.toFixed(0), "W")); 
        satellite.appendChild(printRow("Laser Pwr Output:", (sat.laser_power_draw*lunarSpark.system.satellite.laser_eff).toFixed(0),"W"));
        satellite.appendChild(printTable("Veh", "Rng", "Azm", "Elv", "RxArea", "Int", "Pwr", true));
        satellite.appendChild(printTable("(#)", "(km)", "(deg)", "(deg)", "(m2)", "(W/m2)", "(W)", true));
        for (var i=0;i<sat.vehicles.length;i++) {
            if (i<sat.vehicles.length && lunarSpark.vehicles[i].active == true) {
                satellite.appendChild(printTable(sat.vehicles[i].id, (sat.vehicles[i].range/1000).toFixed(0), sat.vehicles[i].azimuth.toFixed(0), sat.vehicles[i].elevation.toFixed(0), (sat.vehicles[i].rxArea).toFixed(2), sat.vehicles[i].intensity.toFixed(0), sat.vehicles[i].power.toFixed(0)));
            }
            else {
                satellite.appendChild(printTable("---", "---", "---", "---", "---", "---", "---")); 
            }
        }
        // satellite.appendChild(printTable("(#)", "(km)", "(deg)", "(deg)", "(cm)", "(W/m2)", "(W)", true));
        // for (var i=0;i<maxLasersPerSatellite;i++) {
        //     if (i<sat.lasers.length) {
        //         satellite.appendChild(printTable(sat.lasers[i].vehicle, (sat.lasers[i].range/1000).toFixed(0), sat.lasers[i].azimuth.toFixed(0), sat.lasers[i].elevation.toFixed(0), (sat.lasers[i].rxArea*100).toFixed(0), sat.lasers[i].intensity.toFixed(0), sat.lasers[i].power.toFixed(0)));
        //     }
        //       else {
        //         satellite.appendChild(printTable("---", "---", "---", "---", "---", "---", "---")); 
        //     }
        // }
    }
    else {
        satellite.className = "satellite inactive";
        satellite.appendChild(printRow("Satellite["+index+"]:", "---", "-", true));
        satellite.appendChild(printRow("Battery Charge:", "---", "-"));
        satellite.appendChild(document.createElement('meter'));
        satellite.appendChild(printRow("Satellite Pwr Draw:", "---", "-"));
        satellite.appendChild(printRow("Orbit(anomaly):", "---", "-"));
        satellite.appendChild(printRow("Orbit(time/period):", "---/---", "-"));
        satellite.appendChild(printRow("Sub-Satellite(lat/long):", "---/---", "-"));
        satellite.appendChild(printRow("Solar Panel Pwr Output:", "---", "-"));
        satellite.appendChild(printRow("Laser Pwr Draw:", "---", "-")); 
        satellite.appendChild(printRow("Laser Pwr Output:", "---", "-")); 
        satellite.appendChild(printTable("Veh", "Rng", "Azm", "Elv", "RxArea", "Int", "Pwr", true));
        satellite.appendChild(printTable("(#)", "(km)", "(deg)", "(deg)", "(m2)", "(W/m2)", "(W)", true));
        for (var i=0;i<sat.vehicles.length;i++) {
            satellite.appendChild(printTable("---", "---", "---", "---", "---", "---", "---")); 
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

        vehicle.appendChild(printRow("Vehicle["+index+"]: "+veh.id, "("+veh.location.lat+"/"+veh.location.long+")", "deg", true));
        var row = printRow("Battery Charge:", veh.battery.percent.toFixed(1)+"% "+ veh.battery.charge.toFixed(0)+"/"+veh.battery.capacity.toFixed(0), "Wh");
        vehicle.appendChild(row);
        vehicle.appendChild(printBatteryGuage(veh.battery.percent));
        vehicle.appendChild(printRow("Vehicle Pwr Draw:",  (veh.power_draw).toFixed(0), "W"));
        vehicle.appendChild(printRow("Solar Panel Pwr Output:", veh.solar_panel.power_output.toFixed(0), "W"));
        vehicle.appendChild(printRow("Laser Panel Pwr Output:", (veh.laser_panel.power_output).toFixed(0), "W"));
        vehicle.appendChild(printTable("Lsr", "Rng", "Azm", "Elv", "RxArea", "Int", "Pwr", true));
        vehicle.appendChild(printTable("#.#", "(km)", "(deg)", "(deg)", "(m2)", "(W/m2)", "(W)", true));
        for (var i=0;i<maxBeamsPerVehicle;i++) {
            if (i<veh.beams.length) {
                vehicle.appendChild(printTable(veh.beams[i].satellite+"."+veh.beams[i].laser, (veh.beams[i].range/1000).toFixed(0), veh.beams[i].azimuth.toFixed(0), veh.beams[i].elevation.toFixed(0), (veh.beams[i].rxArea).toFixed(2), veh.beams[i].intensity.toFixed(0), veh.beams[i].power.toFixed(0))); 
            }
            else {
                vehicle.appendChild(printTable("-.-", "---", "---", "---", "---", "---", "---")); 
            }
        }
    }
    else {
        vehicle.className = "vehicle inactive";
        vehicle.appendChild(printRow("Vehicle["+index+"]:", "---", "-", true));
        vehicle.appendChild(printRow("Battery Charge:", "---", "-"));
        vehicle.appendChild(document.createElement('meter'));
        vehicle.appendChild(printRow("Vehicle Pwr Draw:",  "---", "-"))
        vehicle.appendChild(printRow("Solar Panel Pwr Output:", "---", "-"));
        vehicle.appendChild(printRow("Laser Panel Pwr Output:", "---", "-"));
        vehicle.appendChild(printTable("Lsr", "Rng", "Azm", "Elv", "RxArea", "Int", "Pwr", true));
        vehicle.appendChild(printTable("#.#", "(km)", "(deg)", "(deg)", "(m2)", "(W/m2)", "(W)", true));
        for (var i=0;i<maxBeamsPerVehicle;i++) {
            vehicle.appendChild(printTable("-.-", "---", "---", "---", "---", "---", "---")); 
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
    div.appendChild(printRow("Execution Rate:", execRate.toFixed(1), "Hz"));
    div.appendChild(printRow("Realtime Rate:", realTime.toFixed(1), "x"));
    
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
    div.appendChild(printRow("Ascending Node:", (lunarSpark.environment.orbit.ascending_node).toFixed(1), "deg"));
    div.appendChild(printRow("Sun Angle:", (lunarSpark.environment.sun_angle).toFixed(1), "deg"));

    simRight = document.getElementById('simStatus2');
    simRight.replaceWith(div);

}
