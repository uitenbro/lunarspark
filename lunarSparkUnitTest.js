var step = 0;
var errorTolerance = .00001;

function initUnitTest() {
	//  Initialize the simulation
	initSim();

	// Override controls for unit test operation
	printUnitTestControl();
}

function printUnitTestControl() {

    var simControl = document.createElement('div')
    simControl.id = "simControl";

    simControl.appendChild(printButton("\u2699", "javascript:initUnitTest();", "configButton")); // TODO: Add load configuration
    simControl.appendChild(printButton("\u25B6","javascript:startUnitTest();", "runButton"));
    simControl.appendChild(printButton("\u23FD\u23FD", "javascript:pauseUnitTest();", "pauseButton"));
    simControl.appendChild(printButton("\u20D5", "javascript:stepUnitTest();", "stepButton"));
    simControl.appendChild(printButton("\u21CA", "javascript:slower();", "slowerButton"));    
    simControl.appendChild(printButton("\u21C8", "javascript:faster();", "fasterButton"));
    simControl.appendChild(printButton("\u21BA", "javascript:initSim();", "recycleButton"));
    
    document.getElementById("simControl").replaceWith(simControl);

}

function startUnitTest() {
	runUnitTest();
}

function pauseUnitTest() {
	null;
}

function runUnitTest() {
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
    stepUnitTest();
    if ((time >= minPerLunarCycle) || (simState != "run")) {
        clearInterval(simRun);
        document.getElementById('runButton').className = "button";
        previousStartTime = 0; // reset start time for exec rate
        printAll(); // ensure final step data has been printed to display
    }
}

function stepUnitTest() {
    //time = time+timeStep;
    //stepModel();

    unitTestCalculateBeamCharacteristics();
    updateUnitTestDisplay();
    step = step+1
}

function updateUnitTestDisplay() {
    clearCanvas();

    drawSubSatellitePoint(0);
    drawVehicle(0);
    // drawAll(time);
    // // if stepping or every 0.20 second 
    // if (simState != "run" || (frameCount%(200/refreshPeriod))==0) {
        printAll(time);
    // }
    // frameCount = frameCount+1;
}
function unitTestCalculateBeamCharacteristics(){

	var testData = [
		// rotate the vehicle around a satellite on south pole	
		{
			"in": {"vehLat": -80, "vehLong": 0, "satLat": -80, "satLong": 90},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},	
		{
			"in": {"vehLat": -80, "vehLong": 30, "satLat": -80, "satLong": 90},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},	
		{
			"in": {"vehLat": -80, "vehLong": 60, "satLat": -80, "satLong": 90},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},		
		{
			"in": {"vehLat": -85, "vehLong": 75, "satLat": -80, "satLong": 90},
			"out":{"range": 402000, "azimuth": 0, "elevation": 90}
		},
		{	"in": {"vehLat": -80, "vehLong": 0, "satLat": -80, "satLong": 80},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},	
		{
			"in": {"vehLat": -80, "vehLong": 30, "satLat": -80, "satLong": 80},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},	
		{
			"in": {"vehLat": -80, "vehLong": 60, "satLat": -80, "satLong": 80},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},		
		{
			"in": {"vehLat": -85, "vehLong": 75, "satLat": -80, "satLong": 80},
			"out": {"range": 402000, "azimuth": 0, "elevation": 90}
		},		
		{
			"in": {"vehLat": -80, "vehLong": 30, "satLat": -80, "satLong": 60},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},		
		{
			"in": {"vehLat": -80, "vehLong": 280, "satLat": -90, "satLong": 0},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},
		// rotate the satellite around a vehicle on the south pole
				// rotate the vehicle around a satellite on south pole	
		{
			"in": {"vehLat": -90, "vehLong": 0, "satLat": -80, "satLong": 0},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},	
		{
			"in": {"vehLat": -90, "vehLong": 90, "satLat": -80, "satLong": 90},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},	
		{
			"in": {"vehLat": -90, "vehLong": 180, "satLat": -80, "satLong": 180},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},		
		{
			"in": {"vehLat": -90, "vehLong": 270, "satLat": -80, "satLong": 270},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},		
		{
			"in": {"vehLat": -90, "vehLong": 30, "satLat": -80, "satLong": 60},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},		
		{
			"in": {"vehLat": -90, "vehLong": 280, "satLat": -90, "satLong": 300},
			"out": {"range": 524260.8509191961, "azimuth": 180, "elevation": 44.8071}
		},

	];

	if (step < testData.length) {

		// Setup vehicle and satellite lat, long
		lunarSpark.vehicles[0].location.lat = testData[step].in.vehLat;
		lunarSpark.vehicles[0].location.long = testData[step].in.vehLong;
		lunarSpark.satellites[0].orbit.lat = testData[step].in.satLat;
		lunarSpark.satellites[0].orbit.long = testData[step].in.satLong;


		// Calculate the beam characteristics between satellite and vehicle
		var {vehIndex, range, azimuth, elevation, diameter, intensity, power} = calculateBeamCharacteristics(0, 0)
		lunarSpark.satellites[0].vehicles[0] = {"id": 0, "range": range, "azimuth": azimuth, "elevation": elevation, "diameter": diameter, "intensity": intensity, "power": power};
		
		var testOutput = {range, azimuth, elevation, diameter, intensity, power};
    			
		// Confirm outputs are correct
		console.log(step)
		console.log(testData[step].in)
		compare(testData[step].out, testOutput);
	}

	else {
		step = -1; // reset step for next test
	}

}

function compare(expected, actual) {
	var pass = true;
	Object.keys(expected).forEach(key => {
		console.log(key, expected[key], actual[key], Math.abs(expected[key]-actual[key]) < errorTolerance);
		pass = pass && (Math.abs(expected[key]-actual[key]) < errorTolerance);
	})
	console.log(pass)
}