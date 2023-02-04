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
		sat.orbit.anomoly = sat.orbit.min/lunarSpark.environment.orbit.period*360;

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

		// Update Satellite/Laser Power Draw
		// draw the power for this time step from the battery (eps efficiency taken on the way into the battery)
		sat.battery.charge = sat.battery.charge - (sat.veh_power_draw*timeStep/60) - (sat.laser_power_draw*timeStep/60); // kWh		
		// if battery charge is negative set to zero
		if (sat.battery.charge < 0) {
			sat.battery.charge = 0;
		}

		// Update satellite battery percentage
		sat.battery.percent = (sat.battery.charge/sat.battery.capacity)*100
	}
}
function updateVehicles() {
	for (var i=0;i<lunarSpark.vehicles.length;i++) {
		var veh = lunarSpark.vehicles[i];

		// Set lunar night input parameters based on vehicle location
		setInNight(veh);

		// TODO: setInShadow(veh)

		// Update solar panel output power
		// If the vehicle is not in lunar night
		if (!veh.location.in_night) {
			// Update solar panel power production
			veh.solar_panel.power_output = veh.solar_panel.height*veh.solar_panel.width * veh.solar_panel.efficiency * solarFluxInLunarOrbit / 1000; // kW 
		}
		else {
			// In lunar night so no solar panel power output
			veh.solar_panel.power_output = 0;
		}

		// Update laser panel output power
		// Loop through vehicle beams and total the power
		var laserPanelPwr = 0;
		for (var j=0;j<veh.beams.length;j++) {
			// If a beam is connected
			// if (typeof(veh.beams[j]) !== "undefined") {
			// 	if (veh.beams[j].laser != "-") {
					// Update solar panel power production
					laserPanelPwr = laserPanelPwr + veh.beams[j].power*veh.laser_panel.efficiency/1000; // kW 
			// 	}
			// }
		}
		// Update laser panel power production
		veh.laser_panel.power_output = laserPanelPwr;

		// Update solar/laser power storage 
		var totalPwrGenerated = veh.solar_panel.power_output + veh.laser_panel.power_output
		// if the solar/laser panel is producing power
		if (totalPwrGenerated > 0) {
			// if charge is less than full
			if (veh.battery.charge < veh.battery.capacity) {
				// add the power provided for this time step to the battery (include eps efficiency)
				veh.battery.charge = veh.battery.charge + (totalPwrGenerated * timeStep/60 * veh.eps_efficiency); // kWh
				// limit charge to maximum capacity
				if (veh.battery.charge > veh.battery.capacity) {
					veh.battery.charge = veh.battery.capacity;
				}
			}
		}

		// Update Vehicle Power Draw 
		// draw the power for this time step from the battery (eps efficiency taken on the way into the battery)
		veh.battery.charge = veh.battery.charge - (veh.power_draw*timeStep/60.0); // kWh		
		// if battery charge is negative set to zero
		if (veh.battery.charge < 0) {
			veh.battery.charge = 0;
		}

		// Update vehicle battery percentage
		veh.battery.percent = (veh.battery.charge/veh.battery.capacity)*100;
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
	// Loop through satellites and vehicle and 
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		var potentialVehicles = [];
		for (var k=0;k<lunarSpark.vehicles.length;k++) {
			// Determine if vehicle is in view
			// TODO: perform line sight calculation
			if (lunarSpark.satellites[i].orbit.anomoly > 15 && lunarSpark.satellites[i].orbit.anomoly < 165) {
					// Determine if vehicle can recieve another beam 
					// if (current beam intensity + new beam intesity) < max intensity {
						potentialVehicles.push(k);
					//}
			}
		}
		var chosenVehicles = [];
		// If potential vehicles exceeds number of lasers
		if (potentialVehicles.length > lunarSpark.satellites[i].laser_count) {
			//TODO: add algorithm or sort to prioritize low power vehicles
			//TODO: consider existing beam intensity to spread power more
			
			for (l=0;l<potentialVehicles.length;l++) {
				var potVeh = potentialVehicles[l];
				// Prefer vehicles who are already charging but not yet 100%
				if (lunarSpark.vehicles[potVeh].beams.length && lunarSpark.vehicles[potVeh].battery.percent < 99) {
					chosenVehicles.push(potVeh)
				}
				else {
					// Determine if a vehicle is low on power
					if (lunarSpark.vehicles[potVeh].battery.percent<50) {  //TODO: use global threshold
						// This will out prioritize already charging vehicles // TODO: prioritize low charges
						chosenVehicles.push(potVeh)
					}
				}
			}
			// Down select to number of available lasers
			chosenVehicles = chosenVehicles.slice(0,lunarSpark.satellites[i].laser_count); 
		}
		else {
			// All potential vehicles can be chosen
			chosenVehicles = potentialVehicles;
		}
		// Loop through lasers to update connections
		var laserConnectCount = 0;
		for (var j=0;j<lunarSpark.satellites[i].laser_count;j++) {
			// if there is a chosen vehicle
			if (j<chosenVehicles.length>0) {
				var chosenVeh = chosenVehicles[0];  // set the chosen vehicle to the first entry because % won't work on zero
				if (chosenVehicles.length > 1) {
					chosenVeh = chosenVehicles[j%(chosenVehicles.length-1)]; 
				}
				// connect the laser to the vehicle (allow multiple lasers to single vehicle)
				connectLaser(i, j, chosenVeh, 1111, 0.7, 2591, (0.7*2591));  // TODO: calculate beam stats using trade report
				laserConnectCount++;
			}
			else {
				// otherwise disconnect the laser
				disconnectLaser(i,j);
			}
		}
		lunarSpark.satellites[i].laser_power_draw = laserConnectCount*1/0.2; // TODO: confirm 20% efficiency to produce 1kW
	}
}
function connectLaser(satellite, laser, vehicle, range, diameter, intensity, power) {
	//TODO: how many beams allowed per vehicles should be a function of intensity not arbitary max number
	// TODO: error connecting if satellite is too low on power
	//  if this laser is currently connected disconnect it
	//if (typeof(lunarSpark.satellites[satellite].lasers[laser]) != "undefined") {
		//if (lunarSpark.satellites[satellite].lasers[laser].vehicle != vehicle) {
			// disconnect laser from old vehicle
			disconnectLaser(satellite, laser);
		//}
	//}
	// Update satellite data store
	//lunarSpark.satellites[satellite].lasers.push({"vehicle": vehicle, "range": range, "diameter": diameter, "intensity": intensity, "power": power });
	lunarSpark.satellites[satellite].lasers.push({"laser": laser, "vehicle": vehicle, "range": range, "diameter": diameter, "intensity": intensity, "power": power });
	// // Scan beams to determine if this laser is already connected to this vehicle
	// var updatedExistingLaser = false;
	// for (var i=0;i<lunarSpark.vehicles[vehicle].beams.length;i++) {
	// 	// if found replace entry with new data
	// 	if (lunarSpark.vehicles[vehicle].beams[i].satellite == satellite && lunarSpark.vehicles[vehicle].beams[i].laser == laser) {
	// 		lunarSpark.vehicles[vehicle].beams[i] = {"satellite": satellite, "laser": laser, "range": range, "diameter": diameter, "intensity": intensity, "power": power }
	// 		updatedExistingLaser = true;
	// 		break;
	// 	}
	// }
	// // if an existing laser was not updated connect a new one 
	// if (!updatedExistingLaser) {
	// 	var connectedNewLaser = true;
		lunarSpark.vehicles[vehicle].beams.push({"satellite": satellite, "laser": laser, "range": range, "diameter": diameter, "intensity": intensity, "power": power});
		// for (var j=0;j<lunarSpark.vehicles[vehicle].beams.length;j++) {
		// 	if (lunarSpark.vehicles[vehicle].beams[j].satellite == "-" && lunarSpark.vehicles[vehicle].beams[j].laser == "-") {
		// 		lunarSpark.vehicles[vehicle].beams[j] = {"satellite": satellite, "laser": laser, "range": range, "diameter": diameter, "intensity": intensity, "power": power }
		// 		connectedNewLaser = true;
		// 		break;
		// 	}
		// }
	// }

	// if more than maxBeamsPerVehicle report a message TODO: reword error message
	if (lunarSpark.vehicles[vehicle].beams.length > maxBeamsPerVehicle) {
		console.log("More beams connected than can be displayed.  Consider expanding maxBeamsPerVehicle.")
	}
}
function disconnectLaser(satellite, laser) {
	var sat = lunarSpark.satellites[satellite];
	var veh = null;
	for (var i=0;i<sat.lasers.length;i++) {
		// if the laser match this laser
		if (sat.lasers[i].laser == laser) {
			// capture the vehicle for second part
			veh = sat.lasers[i].vehicle;
			// remove laser entry
			sat.lasers.splice(i,1);
		}
	}

	// if a vehicle connection is defined
	if (veh != null) {
		var veh = lunarSpark.vehicles[veh];
		// find the vehicle beam entry for this satellite and laser
		for (var i=0;i<veh.beams.length;i++) { 
			// if the entry matches the satellite and laser
			if (veh.beams[i].satellite == satellite && veh.beams[i].laser == laser) {
				// remove beam entry from the vehicle datastore 
				veh.beams.splice(i,1);
				break;
			}
		}
	}
	// remove the vehicle from the satellite datastore
	//lunarSpark.satellites[satellite].lasers.splice(laser,1); 
	// lunarSpark.satellites[satellite].lasers[laser] = {"vehicle": "---", "laser": "---", "range": "---", "diameter": "---", "intensity": "---", "power": "---" }
}
function disconnectAllLasers() {
	// For all satellites
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		// for all lasers
		lunarSpark.satellites[i].lasers = [];
		// for (var j=0;j<maxLasersPerSatellite;j++) {
		// 	lunarSpark.satellites[i].lasers[j] = {"vehicle": "---", "laser": "---", "range": "---", "diameter": "---", "intensity": "---", "power": "---" }
		// }
	}
	// For all vehicles
	for (var i=0;i<lunarSpark.vehicles.length;i++) {
		// for all beams
		lunarSpark.vehicles[i].beams = []; // empty beams array
		// for (var j=0;j<maxBeamsPerVehicle;j++) {
		// 	lunarSpark.vehicles[i].beams[j] = {"satellite": "-", "laser": "-", "range": "---", "diameter": "---", "intensity": "---", "power": "---" }
		// }
	}
}