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

}

function updateSunAngle () {
	lunarSpark.environment.sun_angle = lunarSpark.environment.sun_angle+(timeStep*sunAngleDegreesPerMinute);
}
function updateOrbitAngle () {
	lunarSpark.environment.orbit.ascending_node = lunarSpark.environment.orbit.ascending_node+(timeStep*ascendingNodeDegreesPerMinute);
}