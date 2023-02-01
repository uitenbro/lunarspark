// Save initial data to local storage for later recovery
localStorage.setItem("lunarSparkInput", JSON.stringify(lunarSparkInput));

// Set initial values from input configuration file (global)
var lunarSpark =  JSON.parse(localStorage.getItem("lunarSparkInput"));

// Lunar constants
const moonRadius = 1740000; // meters
const sunAngleDegreesPerMinute = 360/minPerLunarCycle; // deg per min
const ascendingNodeDegreesPerMinute = 360/minPerLunarCycle; // deg per min
const solarFluxInLunarOrbit = 1373; // W/m2

// Orbit inputs
const orbitRadius = moonRadius + lunarSpark.environment.orbit.altitude; // meters

function stepModel() {
	updateSunAngle();
	updateOrbitAngle();
	updateSatellites();
	updateVehicles();
	connectLasers();
}

function updateSunAngle () {
	lunarSpark.environment.sun_angle = lunarSpark.environment.sun_angle+(timeStep*sunAngleDegreesPerMinute);
}
function updateOrbitAngle () {
	lunarSpark.environment.orbit.ascending_node = lunarSpark.environment.orbit.ascending_node+(timeStep*ascendingNodeDegreesPerMinute);
	lunarSpark.environment.orbit.count = Math.floor(time/lunarSpark.environment.orbit.period);
}
function updateSatellites () {
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		var sat = lunarSpark.satellites[i]

		// Update orbit position
		sat.orbit.min = (sat.orbit.min+timeStep)%lunarSpark.environment.orbit.period;
		sat.orbit.anomoly = sat.orbit.min/lunarSpark.environment.orbit.period*360

		// Update Power Production
		sat.solar_panel.power_output = sat.solar_panel.area * sat.solar_panel.efficiency * solarFluxInLunarOrbit / 1000; // kW TODO: inEclipse(sat)

		// Update Power Storage
		// if the solar panel is producing power
		if (sat.solar_panel.power_output>0) {
			// if charge is less than full
			if (sat.battery.charge < sat.battery.capacity) {
				// add the power provided for this time step to the battery (include eps efficiency)
				sat.battery.charge = sat.battery.charge + (sat.solar_panel.power_output * timeStep/60 * sat.eps_efficiency); // kWh
				// limit charge to maximum capacity
				if (sat.battery.charge > sat.battery.capacity) {
					sat.battery.charge = sat.battery.capacity;
				}
			}
		}

		// Update Satellite Power Draw (Laser Power Draw is updated after laser connections are calculated)
		// draw the power for this time step from the battery (eps efficiency taken on the way into the battery)
		sat.battery.charge = sat.battery.charge - (sat.veh_power_draw*timeStep/60); // kWh		
		// if battery charge is negative set to zero
		if (sat.battery.charge < 0) {
			sat.battery.charge = 0;
		}
	}
}
function updateVehicles() {
	for (var i=0;i<lunarSpark.vehicles.length;i++) {
		var veh = lunarSpark.vehicles[i];

		// Set lunar night input parameters based on vehicle location
		setInNight(veh);

		// TODO: nShadow(veh)
		
		// If the vehicle is not in lunar night
		if (!veh.location.in_night) {
			// Update solar panel power production
			veh.solar_panel.power_output = veh.solar_panel.height*veh.solar_panel.width * veh.solar_panel.efficiency * solarFluxInLunarOrbit / 1000; // kW 
		}
		else {
			// In lunar night so no solar panel power output
			veh.solar_panel.power_output = 0;
		}

		// Update solar power storage 
		// if the solar panel is producing power
		if (veh.solar_panel.power_output>0) {
			// if charge is less than full
			if (veh.battery.charge < veh.battery.capacity) {
				// add the power provided for this time step to the battery (include eps efficiency)
				veh.battery.charge = veh.battery.charge + (veh.solar_panel.power_output * timeStep/60 * veh.eps_efficiency); // kWh
				// limit charge to maximum capacity
				if (veh.battery.charge > veh.battery.capacity) {
					veh.battery.charge = veh.battery.capacity;
				}
			}
		}

		// Update laser power storage


		// Update Vehicle Power Draw 
		// draw the power for this time step from the battery (eps efficiency taken on the way into the battery)
		veh.battery.charge = veh.battery.charge - (veh.power_draw*timeStep/60); // kWh		
		// if battery charge is negative set to zero
		if (veh.battery.charge < 0) {
			veh.battery.charge = 0;
		}
	}
}
function setInNight(veh) {
	// Convert longitude to 360 coordinates  // sun angles 90-180 not working
	var vehLong = (veh.location.long+360)%360

	// Calculate the difference between sun angle and long angle
	var diffInVehAndSunAngle = Math.abs(lunarSpark.environment.sun_angle-vehLong);

	// if the andgle difference is greater than 90 deg then vehicle location is on the dark side of the sun angle it is in a lunar night
	if (diffInVehAndSunAngle > 90 && diffInVehAndSunAngle < 270) {
		veh.location.in_night = true;
	}
	else {
		veh.location.in_night = false;
	}
}

function connectLasers() {
	var veh = -1;
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		for (var j=0;j<lunarSpark.satellites[i].lasers.length;j++) {
			veh = (veh+1)%8
			// Algorithm for connections
			connectLaser(i, j, veh);
		}
	}
}
function connectLaser(satellite, laser, vehicle) {
	lunarSpark.satellites[satellite].lasers[laser].vehicle = vehicle;
	if (lunarSpark.vehicles[vehicle].beams.length > 3) {
		lunarSpark.vehicles[vehicle].beams.pop();
	}
	lunarSpark.vehicles[vehicle].beams.push({"satellite": satellite, "laser": laser});
}