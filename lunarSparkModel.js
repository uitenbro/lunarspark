var lunarSpark = lunarSparkInput;

// Lunar constants
const moonRadius = 1740000; // meters
const sunAngleDegreesPerMinute = 360/minPerLunarCycle; // deg per min
const ascendingNodeDegreesPerMinute = 360/minPerLunarCycle; // deg per min

// Orbit inputs
const orbitRadius = moonRadius + lunarSpark.environment.orbit.altitude; // meters

function stepModel() {
	updateSunAngle();
	updateOrbitAngle();
	updateSatellitePosition();
	updateCustomers();
	connectLasers()
}

function updateSunAngle () {
	lunarSpark.environment.sun_angle = lunarSpark.environment.sun_angle+(timeStep*sunAngleDegreesPerMinute);
}
function updateOrbitAngle () {
	lunarSpark.environment.orbit.ascending_node = lunarSpark.environment.orbit.ascending_node+(timeStep*ascendingNodeDegreesPerMinute);
}
function updateSatellitePosition () {
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		lunarSpark.satellites[i].orbit_min = (lunarSpark.satellites[i].orbit_min+timeStep)%lunarSpark.environment.orbit.period;
		lunarSpark.satellites[i].orbit_angle = lunarSpark.satellites[i].orbit_min/lunarSpark.environment.orbit.period*360
	}
}
function updateCustomers() {
	null;
}
function connectLasers() {
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		for (var j=0;j<lunarSpark.satellites[i].lasers.length;j++) {
			var customer = (i+j)%8
			// Algorithm for connections
			connectLaser(i, j, customer);
		}
	}
}
function connectLaser(satellite, laser, customer) {
	lunarSpark.satellites[satellite].lasers[laser].customer = customer
}