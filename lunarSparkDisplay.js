// Global simulation control parameters
var time = 0 // minutes
var refreshPeriod = 10 // 10msec (100Hz)
var timeStep = 1; // min/refresh
var timeSteps = [0.1, 0.25,0.5,1,2,3,4,5,6]
var savedTimeStep = timeStep;
var simState = "pause";
var previousStartTime = 0;
var elapsedTime = 0; // msec
var prevAvgElapsedTime = 10; // msec
var avgElapsedTime = 10; // msec
var execRate = 100; // Hz
var realTime = execRate * timeStep*60// step/sec * min/step
var frameCount = 0;
var spinLock = true;
var simStatusStriptChartOn = false
var formatToggle = true

// Display thresholds
const battRedThreshold = 25 // %
const battOrangeThreshold = 50 // %


const maxLasersPerSatellite = 1;
const maxBeamsPerVehicle = 1;

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
    if (lunarSpark.environment.time_step != undefined) {
        timeStep =  lunarSpark.environment.time_step;
    }
    else {
        timeStep = 1
    }
    // timeStep = 1; // min/refresh 
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
    canvas.width = moonImgWidth + 2*orbitDistanceOffset
    canvas.height = moonImgWidth + 2*orbitDistanceOffset;     
    originX = canvas.width/2; // intentionall global
    originY = canvas.height/2; // intentionally global


    // step sim with zero time to initialize all dervived parameters
    initializeDataLog();
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
    lunarSpark.environment.time = time
    
    stepModel();
    
    // restore previous time step
    timeStep = savedTimeStep;

    updateDisplay();
}

function runSim() {

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
    if ((time >= minPerSinodicLunarCycle) || (simState != "run")) {
        clearInterval(simRun);
        document.getElementById('runButton').className = "button";
        document.getElementById('pauseButton').className = "buttonDisabled";
        previousStartTime = 0; // reset start time for exec rate
        printAll(); // ensure final step data has been printed to display
    }
}
function startSim() {
    simState = "run"
    simRun = setInterval(runSim, refreshPeriod);
    document.getElementById('runButton').className = "buttonDisabled"
    document.getElementById('pauseButton').className = "button"
}
function pauseSim() {
    simState = "pause"
    document.getElementById('runButton').className = "button"
    document.getElementById('pauseButton').className = "buttonDisabled"
}

function faster() {
    var index = timeSteps.indexOf(timeStep)+1
    if (index < timeSteps.length) {
        timeStep = timeSteps[index];
    }
    savedTimeStep = timeStep;
    realTime = execRate * timeStep*60
    printSimData();
}
function slower() {
    var index = timeSteps.indexOf(timeStep)-1
    if (index >= 0) {
        timeStep = timeSteps[index];
    }
    savedTimeStep = timeStep;
    realTime = execRate * timeStep*60
    printSimData();
}

function printButton(label, action, id) {
    if (id == "configButton"){
        var a = document.createElement('input')
        a.type="file" 
        accept=".json" 
        a.id = id
        a.className = "custom-file-input" 
        a.addEventListener('change', loadFile)
    }
    else if (id == "configButtonLabel"){
        var a = document.createElement('label')
        a.htmlFor = "configButton";
        a.className = "button"
        a.textContent = label

        //  <label for="fileInput" class="custom-file-label">Load JSON</label>
        //  <input type="file" id="fileInput" accept=".json" class="custom-file-input" onchange="loadJSONFile(event)">
    }
    else {    
        var a = document.createElement('a')
        a.href = action; 
        if (id == "pauseButton" || id == "simStatusStripChartDown") {
            a.className = "buttonDisabled";
        }    
        else if (id == "saveButton") {
            a.className = "buttonUnderline";
        }
        else {
            a.className = "button"
        }
        a.id = id;
        a.appendChild(document.createTextNode(label));
    }
    return a    
}
function printSimControl() {

    var simControl = document.createElement('div')
    simControl.id = "simControl";

    simControl.appendChild(printButton("\u2699", "javascript:loadFile();", "configButton")); // TODO: Add load configuration
    simControl.appendChild(printButton("\u2699", "javascript:loadFile();", "configButtonLabel")); // TODO: Add load configuration
    simControl.appendChild(printButton("\u25B6","javascript:startSim();", "runButton"));
    simControl.appendChild(printButton("\u23FD\u23FD", "javascript:pauseSim();", "pauseButton"));
    // simControl.appendChild(printButton("\u20D5", "javascript:stepSim();", "stepButton"));
    // simControl.appendChild(printButton("\u21E5", "javascript:stepSim();", "stepButton"));
    simControl.appendChild(printButton("\u276F", "javascript:stepSim();", "stepButton"));
    simControl.appendChild(printButton("\u21CA", "javascript:slower();", "slowerButton"));    
    simControl.appendChild(printButton("\u21C8", "javascript:faster();", "fasterButton"));
    //simControl.appendChild(printButton("\uD83D\uDCBE", "javascript:saveFile();", "saveButton"));
    simControl.appendChild(printButton("\u2193", "javascript:saveFile();", "saveButton"));
    simControl.appendChild(printButton("\u21BA", "javascript:initSim();", "recycleButton"));
    // simControl.appendChild(printButton("\u27F9", "javascript:simStatusStripChartToggle()", "simStatusStripChartUp"));
    // simControl.appendChild(printButton("\u27FA", "javascript:simStatusStripChartToggle()", "simStatusStripChartDown"));
    // simControl.appendChild(printButton("\u2192", "javascript:simStatusStripChartToggle()", "simStatusStripChartUp"));
    // simControl.appendChild(printButton("\u2194", "javascript:simStatusStripChartToggle()", "simStatusStripChartDown"));
    simControl.appendChild(printButton("\u21D2", "javascript:simStatusStripChartToggle()", "simStatusStripChartUp"));
    simControl.appendChild(printButton("\u21D4", "javascript:simStatusStripChartToggle()", "simStatusStripChartDown"));
    simControl.appendChild(printButton("O", "javascript:displayFormatToggle()", "displayButton"));

    document.getElementById("simControl").replaceWith(simControl);

}

function updateDisplay() {
    // if stepping or every so many frames depending on refreshPeriod and achieved realtime rate 
    if (simState != "run" || (frameCount%(40/refreshPeriod))==0) {
        clearCanvas();
        drawAll(time);    
    }    
    // if stepping or every so many frames depending on refreshPeriod and achieved realtime rate 
    if (simState != "run" || (frameCount%(400/refreshPeriod))==0) {
        printAll(time);
    }
    frameCount = frameCount+1;
}

function printAll() {
    printSimData();   
    printSatellites();
    printVehicles();
    printSimStripCharts();
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
        underline = " bold";
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
    if (batteryPecent < battRedThreshold) {
        batteryGauge.className = "red";
    }
    else if (batteryPecent < battOrangeThreshold) {
        batteryGauge.className = "orange";
    }
    else {
        batteryGauge.className = "green";
    }


    return batteryGauge;
}
function printSatellites() {
    var sat = document.getElementById('simLeft');
    if (spinLock) {
        // setup initial layout
        chart = new Chart(document.createElement('canvas'));
        for (var i=0;i<lunarSpark.satellites.length;i++) {
            if (i%2 == 0) {
                sat = document.getElementById('simLeft');
            }
            else {
                sat = document.getElementById('simRight');
            }
            sat.appendChild(printSatellite(chart, i));
        }
        spinLock = false;
    }
    // update satellite in place
    else {
        for (var i=0;i<lunarSpark.satellites.length;i++) {
            sat = document.getElementById("sat-"+i)
            sat.replaceWith(printSatellite(chart, i))
        }
    }
}
function printSatellite(chart, index) {
    var sat = lunarSpark.satellites[index]
    var satellite = document.createElement('div');
    satellite.id = "sat-"+index

    if (sat.active) {
        // if (sat.orbit.anomaly >= orbitVisibilityLowerBound+satelliteVisibilityOffset && sat.orbit.anomaly <= orbitVisibilityUpperBound-satelliteVisibilityOffset) {
        //     satellite.className = "satellite notinview";
        // }
        // else {
            satellite.className = "satellite inview";
        // }

        // TODO: add orbit count
        
        satellite.appendChild(printRow("Satellite["+index+"]:", sat.id, "-", false));
        // satellite.appendChild(printRow("", "", "", true));
        satellite.appendChild(printRow("Orbit(anomaly):", sat.orbit.anomaly.toFixed(1), "deg"));
        satellite.appendChild(printRow("Sub-Satellite(lat/long):", sat.orbit.lat.toFixed(1)+"/"+sat.orbit.long.toFixed(1), "deg"));
        satellite.appendChild(printRow("Orbit(time/period):", sat.orbit.min.toFixed(0)+"/"+lunarSpark.environment.orbit.period, "min"));
        satellite.appendChild(printBatteryGuage(sat.battery.percent)); 
        var row = printRow("Battery Charge:", sat.battery.percent.toFixed(1)+"% "+ sat.battery.charge.toFixed(0)+"/"+sat.battery.capacity.toFixed(0), "Wh");
        satellite.appendChild(row); 
        satellite.appendChild(printRow("Solar Panel Pwr Output:", sat.solar_panel.power_output.toFixed(0), "W"));        
        satellite.appendChild(printRow("Satellite Pwr Draw:", sat.sat_power_draw.toFixed(0), "W"));
        // satellite.appendChild(printRow("Laser Power Draw (duty cycle):", (sat.laser_power_draw * lunarSpark.system.satellite.laser_duty_cycle).toFixed(0), "W")); 
        // satellite.appendChild(printRow("Laser Power Output:", (sat.laser_power_draw*lunarSpark.system.satellite.laser_eff).toFixed(0),"W"));
        satellite.appendChild(printRow("Undelivered Laser Capacity:", (sat.cumulative_undelivered_laser_capacity).toFixed(0), "Wh"));
        satellite.appendChild(printRow("Total Laser Energy Draw:", (sat.cumulative_laser_energy_draw).toFixed(0),"Wh"));
        satellite.appendChild(printRow("Total Laser Energy Output:", (sat.cumulative_laser_energy_output).toFixed(0),"Wh"));
        satellite.appendChild(printRow("", "", "", true));
        satellite.appendChild(printTable("-", "Beams", "Last", "Min", "Max",  "Avg", "-", false));
        satellite.appendChild(printTable("-", "(#)", "(min)", "(min)", "(min)", "(min)", "-", false));
        
        satellite.appendChild(printTable("-", sat.beam_metrics.beam_count, sat.beam_metrics.last_beam.toFixed(1), sat.beam_metrics.min_beam.toFixed(1), sat.beam_metrics.max_beam.toFixed(1), sat.beam_metrics.avg_beam.toFixed(1), "-"));
        satellite.appendChild(printRow("", "", "", true));
        satellite.appendChild(printTable("-", "Veh", "Elv", "InDark", "TTL", "BatAvl", "-", false));
        satellite.appendChild(printTable("-", "(#)", "(deg)", "(y/n)", "(min)", "(Wh)", "-", false));
        for (var i=0;i<sat.vehicles.length;i++) {
            if (lunarSpark.vehicles[i].active == true) {
                if (sat.chosen_vehicle != -1 && sat.vehData != -1) {
                    var vehData = sat.vehData[i]
                    var inDark = "no"
                    if (vehData.location.in_night || vehData.location.in_shadow) {inDark = "yes"}
                }
                else {
                    var vehData = {}
                    vehData["ttl_pred"] = -1
                    vehData["battery_available_pred"] = -1
                    var inDark = "--"
                }
                var veh = sat.vehicles[i]
                
                satellite.appendChild(printTable("-", i, veh.elevation.toFixed(0), inDark, vehData.ttl_pred.toFixed(0), (vehData.battery_available_pred).toFixed(0), "-", sat.chosen_vehicle.index == i));
            }
            else {
                satellite.appendChild(printTable("--", "--", "--", "--", "--", "--", "--")); 
            }
        }
        satellite.appendChild(printRow("", "", "", true));
        satellite.appendChild(updateStripChart("sat", index))
    }
    // else {
    //     satellite.className = "satellite inactive";
    //     satellite.appendChild(printRow("Satellite["+index+"]:", "---", "-", true));
    //     satellite.appendChild(printRow("Orbit(anomaly):", "---", "-"));
    //     satellite.appendChild(printRow("Orbit(time/period):", "---/---", "-"));
    //     satellite.appendChild(printRow("Sub-Satellite(lat/long):", "---/---", "-"));
    //     satellite.appendChild(printRow("Battery Charge:", "---", "-"));
    //     satellite.appendChild(document.createElement('meter'));
    //     satellite.appendChild(printRow("Solar Panel Pwr Output:", "---", "-"));
    //     satellite.appendChild(printRow("Satellite Pwr Draw:", "---", "-"));
    //     satellite.appendChild(printRow("Laser Pwr Draw (duty cycle):", "---", "-")); 
    //     satellite.appendChild(printRow("Laser Pwr Output:", "---", "-")); 
    //     satellite.appendChild(printTable("Veh", "Rng", "Azm", "Elv", "RxArea", "Int", "Pwr", true));
    //     satellite.appendChild(printTable("(#)", "(km)", "(deg)", "(deg)", "(m2)", "(W/m2)", "(W)", true));
    //     for (var i=0;i<sat.vehicles.length;i++) {
    //         satellite.appendChild(printTable("---", "---", "---", "---", "---", "---", "---")); 
    //     }

    // }

    return satellite;
}

function printVehicles() {
    var vehDiv = document.createElement('div');
    vehDiv.id = "vehicles";
    for (i=0;i<lunarSpark.vehicles.length;i++) {
        vehDiv.appendChild(printVehicle(i));
    }   
    
    // clear vehicles from previous cycle
    console.log(document.getElementById("vehicles"))
    if (document.getElementById("vehicles") != null){
        document.getElementById("vehicles").replaceWith(document.createElement("div"));
    }

    // decide where to print the vehicles
    if (formatToggle) {
        document.getElementById("bottom").replaceChildren(vehDiv);
    }
    else {
        // clear bottom div to fix stripcharts
        document.getElementById("bottom").replaceChildren(document.createElement("div"));
        // add vehicles to the middle
        document.getElementById("middle").appendChild(vehDiv);
    }
}

function printVehicle(index) {
    var veh = lunarSpark.vehicles[index];
    var vehicle = document.createElement('div');
    if (veh.active) {
        if (veh.location.in_night || veh.location.in_shadow) {
            vehicle.className = "vehicle inshadow";
        }
        else {
            vehicle.className = "vehicle notinshadow";
        }

        vehicle.appendChild(printRow("Veh["+index+"]:", veh.id, "-", false));
        vehicle.appendChild(printRow("Location:", veh.location.name + " (" + veh.location.lat+"/"+veh.location.long+")", "deg", false));
        //vehicle.appendChild(printRow("", "", "", true));
        vehicle.appendChild(printBatteryGuage(veh.battery.percent));
        var row = printRow("Battery Charge:", veh.battery.percent.toFixed(1)+"% "+ veh.battery.charge.toFixed(0)+"/"+veh.battery.capacity.toFixed(0), "Wh");
        vehicle.appendChild(row);
        vehicle.appendChild(printRow("Vehicle Pwr Draw:",  (veh.power_draw).toFixed(0), "W"));
        vehicle.appendChild(printRow("Time to Live (TTL):", veh.ttl.toFixed(1), "min"));
        //vehicle.appendChild(printRow("TTL below "+lunarSpark.test_case.ttl_threshold+" min:", veh.ttl_below_threshold.toFixed(1), "min"));
        vehicle.appendChild(printRow("TTL below zero:", veh.ttl_below_zero.toFixed(1), "min"));
        //vehicle.appendChild(printBatteryGuage(veh.ttl_percent));
        vehicle.appendChild(printRow("", "", "", true));
        vehicle.appendChild(printRow("Solar Panel Pwr Output:", veh.solar_panel.power_output.toFixed(0), "W"));
        //vehicle.appendChild(printRow("Laser Panel Pwr Output:", (veh.laser_panel.power_output).toFixed(0), "W"));
        vehicle.appendChild(printRow("Total Laser Panel Output:", (veh.cumulative_laser_panel_energy).toFixed(0), "Wh"));
        vehicle.appendChild(printRow("Excess Laser Panel Output:", (veh.excess_laser_panel_energy).toFixed(0), "Wh"));
        vehicle.appendChild(printRow("", "", "", true));
        vehicle.appendChild(printTable("-", "Beams", "Last", "Min", "Max",  "Avg", "-", false));
        vehicle.appendChild(printTable("-", "(#)", "(Wh)", "(Wh)", "(Wh)", "(Wh)", "-", false));
        
        vehicle.appendChild(printTable("-", veh.beam_metrics.beam_count, veh.beam_metrics.last_beam_energy.toFixed(0), veh.beam_metrics.min_beam_energy.toFixed(0), veh.beam_metrics.max_beam_energy.toFixed(0), veh.beam_metrics.avg_beam_energy.toFixed(0), "-"));
        vehicle.appendChild(printRow("", "", "", true));
        // vehicle.appendChild(printTable("Lsr", "Rng", "Azm", "Elv", "RxArea", "Int", "Pwr", false));
        // vehicle.appendChild(printTable("#.#", "(km)", "(deg)", "(deg)", "(m2)", "(W/m2)", "(W)", false));
        // for (var i=0;i<maxBeamsPerVehicle;i++) {
        //     if (i<veh.beams.length) {
        //         vehicle.appendChild(printTable(veh.beams[i].satellite+"."+veh.beams[i].laser, (veh.beams[i].range/1000).toFixed(0), veh.beams[i].azimuth.toFixed(0), veh.beams[i].elevation.toFixed(0), (veh.beams[i].rxArea).toFixed(2), veh.beams[i].intensity.toFixed(0), veh.beams[i].power.toFixed(0))); 
        //     }
        //     else {
        //         vehicle.appendChild(printTable("-.-", "---", "---", "---", "---", "---", "---")); 
        //     }
        // }
        // vehicle.appendChild(printRow("", "", "", true));
        vehicle.appendChild(updateStripChart("veh", index))
    }
    else {
        vehicle.className = "vehicle inactive";
        vehicle.appendChild(printRow("Veh["+index+"]:", veh.id, "-", false));
        vehicle.appendChild(printRow("Location:",  "--- (--/--", "deg", false));
        vehicle.appendChild(document.createElement('meter'));
        vehicle.appendChild(printRow("Battery Charge:", "---", "-"));
        vehicle.appendChild(printRow("Vehicle Pwr Draw:",  "---", "-"));
        vehicle.appendChild(printRow("Time to Live (TTL):", "---", "min"));
        vehicle.appendChild(printRow("TTL below zero:", "---", "min"));
        vehicle.appendChild(printRow("", "", "", true));
        vehicle.appendChild(printRow("Solar Panel Pwr Output:", "---", "-"));
        vehicle.appendChild(printRow("Total Laser Panel  Output:", "---", "-"));
        vehicle.appendChild(printRow("Excess Laser Panel  Output:", "---", "-"));
        vehicle.appendChild(printRow("", "", "", true));
        vehicle.appendChild(printTable("-", "Beams", "Last", "Min", "Max",  "Avg", "-", false));
        vehicle.appendChild(printTable("-", "(#)", "(Wh)", "(Wh)", "(Wh)", "(Wh)", "-", false));
        vehicle.appendChild(printTable("-", "--", "--", "==", "--", "--", "-"));
        vehicle.appendChild(printRow("", "", "", true));
        vehicle.appendChild(updateStripChart("veh", index))
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
    div.appendChild(printRow("", "", "", true));
    div.appendChild(printRow("Elapsed Time:", time.toFixed(0), "min"));
    div.appendChild(printRow("Days:", Math.floor(time/(24*60)), "days"));
    div.appendChild(printRow("Hrs:", Math.floor(time/60)%24, "hrs"));
    div.appendChild(printRow("Min:", (time%60).toFixed(0), "min"));
    div.appendChild(printRow("", "", "", true));
    div.appendChild(printRow("Orbit Count:", (lunarSpark.environment.orbit.count), "-"));
    div.appendChild(printRow("Ascending Node:", (lunarSpark.environment.orbit.ascending_node).toFixed(1), "deg"));
    div.appendChild(printRow("Sun Angle:", (lunarSpark.environment.sun_angle).toFixed(1), "deg"));
  
    simStatus = document.getElementById('simStatus1');
    simStatus.replaceWith(div);

    // Right sim status
    var div = document.createElement('div');
    div.id = "simStatus2";

    div.appendChild(printRow("Config File:", lunarSpark.test_case.filename, ""));
    div.appendChild(printRow("Veh Config:", lunarSpark.test_case.vehicle_configuration, ""));
    //div.appendChild(printRow("Pwr Delivery:", lunarSpark.test_case.power_delivery_strategy, ""));
    div.appendChild(printRow("", "", "", true));
    div.appendChild(printRow("Total Laser Energy Draw:", (lunarSpark.environment.cumulative_laser_energy_draw/1000).toFixed(1), "kWh"));
    div.appendChild(printRow("Total Laser Energy Output:", (lunarSpark.environment.cumulative_laser_energy_output/1000).toFixed(1), "kWh"));
    div.appendChild(printRow("Undelivered Laser Capacity:", (lunarSpark.environment.cumulative_undelivered_laser_capacity/1000).toFixed(1), "kWh"));
    div.appendChild(printRow("Total Laser Panel Output:", (lunarSpark.environment.cumulative_laser_panel_energy/1000).toFixed(1), "kWh"));
    div.appendChild(printRow("Excess Laser Panel Output:", (lunarSpark.environment.excess_laser_panel_energy/1000).toFixed(1), "kWh"));
    div.appendChild(printRow("Usable Laser Panel Output:", (lunarSpark.environment.usable_energy/1000).toFixed(1), "kWh"));

    // div.appendChild(printTable("----","Laser Draw", "Laser Output", "Undlv Cap", "LsrPnl Output ", "Excess LsrPnl ", "Usable LsrPnl", false));
    // div.appendChild(printTable("-", "(kWh)", "(kWh)", "(KWh)", "(kWh)", "(kWh)", "(kWh)", false));
    // div.appendChild(printTable("-",(lunarSpark.environment.cumulative_laser_energy_draw/1000).toFixed(0), 
    //                            (lunarSpark.environment.cumulative_laser_energy_output/1000).toFixed(0),
    //                            (lunarSpark.environment.cumulative_undelivered_laser_capacity/1000).toFixed(1),
    //                            (lunarSpark.environment.cumulative_laser_panel_energy/1000).toFixed(1),
    //                            (lunarSpark.environment.excess_laser_panel_energy/1000).toFixed(1),
    //                            (lunarSpark.environment.usable_energy/1000).toFixed(1)));
    div.appendChild(printRow("", "", "", true));
    // div.appendChild(printRow("Laser Energy Draw:", (lunarSpark.environment.cumulative_laser_energy_draw/1000).toFixed(1), "kWh"));
    // div.appendChild(printRow("Laser Energy Output:", (lunarSpark.environment.cumulative_laser_energy_output/1000).toFixed(1), "kWh"));
    // div.appendChild(printRow("Laser Panel Output:", (lunarSpark.environment.cumulative_laser_panel_energy/1000).toFixed(1), "kWh"));
    // div.appendChild(printRow("Undelivered Capacity:", (lunarSpark.environment.cumulative_undelivered_laser_capacity/1000).toFixed(1), "kWh"));
    // div.appendChild(printRow("Excess Laser Panel Output:", (lunarSpark.environment.excess_laser_panel_energy/1000).toFixed(1), "kWh")); 
    // div.appendChild(printRow("Usable Laser Panel Output:", ((lunarSpark.environment.usable_energy)/1000).toFixed(1), "kWh"));
    //div.appendChild(printRow("-", "--------------------", "------------------", ""));
    // div.appendChild(printRow("Excess Laser Panel Percent:", (lunarSpark.environment.excesss_percent).toFixed(3), "%"));
    div.appendChild(printRow("Delivered Energy Efficiency:", (lunarSpark.environment.delivered_efficiency).toFixed(3), "%"));
    div.appendChild(printRow("Usable Energy Efficiency:", (lunarSpark.environment.overall_efficiency).toFixed(3), "%"));
    div.appendChild(printRow("", "", "", true));
    div.appendChild(printRow("TTL Below "+lunarSpark.test_case.ttl_threshold+" min:", (lunarSpark.environment.ttl_below_threshold).toFixed(1), "min"));
    div.appendChild(printRow("TTL Below Zero:", (lunarSpark.environment.ttl_below_zero).toFixed(1), "min"));
    div.appendChild(printRow("Vehicles Frozen:", getTtlBelowZeroCount(), "veh"));

    simRight = document.getElementById('simStatus2');
    simRight.replaceWith(div);

}
function simStatusStripChartToggle() {
    simStatusStriptChartOn = !simStatusStriptChartOn
    if (document.getElementById('simStatusStripChartUp').className == "button") {
        document.getElementById('simStatusStripChartUp').className = "buttonDisabled";
        document.getElementById('simStatusStripChartDown').className = "button";
    }
    else {
        document.getElementById('simStatusStripChartUp').className = "button";
        document.getElementById('simStatusStripChartDown').className = "buttonDisabled";
    }
    printAll()
}

function printSimStripCharts() {
    // if (simStatusStriptChartOn) {
        var div = document.createElement('div');
        div.id = "simStatusStripCharts";
        
        for (var chart of ["ttl", "efficiency", "capacity"]) {
            var stripchart = document.createElement('div');
            stripchart.className = "simStatusStripChart";
            stripchart.appendChild(updateSimStatusStripChart(chart,simStatusStriptChartOn))
            div.appendChild(stripchart)
        }
        document.getElementById('bottom').appendChild(div)
        printTtlDeliveryStripCharts(simStatusStriptChartOn)
    //}
    // else {
    //     printTtlDeliveryStripCharts()
    // }
}

function printTtlDeliveryStripCharts(total=false) {
    var div = document.createElement('div');
    div.id = "ttlDelvieryStripCharts";

    var stripchart = document.createElement('div');
    stripchart.className = "ttlDeliveryStripChart";
    stripchart.appendChild(updateTtlDeliveryStripChart("veh_ttl", total))
    div.appendChild(stripchart)
    document.getElementById('bottom').insertBefore(div, document.getElementById('bottom').firstChild)
}

function getTtlBelowZeroCount() {
    var count = 0
    for (var i=0;i<lunarSpark.vehicles.length;i++) {
        if (lunarSpark.vehicles[i].ttl_below_zero > 0) {
            count += 1
        }
    }
    return count.toFixed(0) + "/" + lunarSpark.vehicles.length
}

function displayFormatToggle() {
    if (document.getElementById('simCanvas').style.display == 'inline') {
        document.getElementById('simCanvas').style.display = 'none' 
        document.getElementById('simRight').style.float = 'left' 
        formatToggle = false
    }
    else {
        document.getElementById('simCanvas').style.display = 'inline'
        document.getElementById('simRight').style.float = 'right' 
        formatToggle = true
    }
    printAll();
}
