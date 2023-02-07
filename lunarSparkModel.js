// Save initial data to local storage for later recovery
localStorage.setItem("lunarSparkInput", JSON.stringify(lunarSparkInput));

// Set initial values from input configuration file (global)
var lunarSpark =  JSON.parse(localStorage.getItem("lunarSparkInput"));

// Lunar constants
const minPerDay = 60*24; // minutes per day (earth)
const daysPerLunarCycle = 29.5; // earth days per lunar cycle with respect to sun

const minPerLunarCycle = daysPerLunarCycle*minPerDay;
const sunAngleDegreesPerMinute = 360/minPerLunarCycle; // deg per min
const ascendingNodeDegreesPerMinute = 360/minPerLunarCycle; // deg per min

const solarFluxInLunarOrbit = 1373; // W/m2
const moonRadius = 1740000; // meters

// Orbit inputs
const orbitRadius = moonRadius + lunarSpark.environment.orbit.altitude; // meters

// Laser Constants
const laserBeamWavelength = 1070; // nanometers (not used)
const laserBeamOutputPower = 1000; // Watts
const laserBeamDivergence = 0.0005/1000 // milli-radians/2/1000 = radians
const laserBeamDivergenceHalfAngle = laserBeamDivergence/2 // radians
const laserBeamInitialDiameter = .50 // meters

function stepModel() {
	updateSunAngle();
	updateascendingNode();
	updateSatellites();
	updateVehicles();
	connectLasers();
}

function updateSunAngle () {
	lunarSpark.environment.sun_angle = lunarSpark.environment.sun_angle+(timeStep*sunAngleDegreesPerMinute);
}
function updateascendingNode () {
	lunarSpark.environment.orbit.ascending_node = lunarSpark.environment.orbit.ascending_node+(timeStep*ascendingNodeDegreesPerMinute);
	lunarSpark.environment.orbit.count = Math.floor(time/lunarSpark.environment.orbit.period);
}
function updateSatellites () {
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		var sat = lunarSpark.satellites[i]

		// Update orbit position
		sat.orbit.min = (sat.orbit.min+timeStep)%lunarSpark.environment.orbit.period;
		sat.orbit.anomaly = sat.orbit.min/lunarSpark.environment.orbit.period*360;

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
		if (veh.active) {
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
}
function setInNight(veh) {
	// Convert longitude (+/- 0-180) to 360 coordinates
	var vehLong = convert180to360(veh.location.long)

	// Calculate the difference between sun angle and long angle
	var diffInVehAndSunAngle = Math.abs(lunarSpark.environment.sun_angle-vehLong);

	// if the angle difference is greater than 90 deg then vehicle location is on the dark side of the sun angle it is in a lunar night
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
		if (lunarSpark.satellites[i].active) {
			var potentialVehicles = [];
			for (var k=0;k<lunarSpark.vehicles.length;k++) {
				if (lunarSpark.vehicles[k].active) {
					// Determine beam characteristics for this vehicle
					var {vehIndex, range, azimuth, elevation, diameter, intensity, power} = calculateBeamCharacteristics(i,k);
					// TODO: perform line sight calculation
					if (elevation > 12) { // TODO: consider shadow model (needs azimuth)
							// Determine if vehicle can recieve another beam 
							// if (current beam intensity + new beam intesity) < max intensity {
								potentialVehicles.push({vehIndex, range, azimuth, elevation, diameter, intensity, power});
							//}
					}
				}
			}
			var chosenVehicles = [];
			// If potential vehicles exceeds number of lasers
			if (potentialVehicles.length > lunarSpark.satellites[i].laser_count) {
				//TODO: add algorithm or sort to prioritize low power vehicles
				//TODO: consider existing beam intensity to spread power more
				
				for (l=0;l<potentialVehicles.length;l++) {
					var potVeh = potentialVehicles[l]
					// Prefer vehicles who are already charging but not yet 100%
					// if (lunarSpark.vehicles[potVeh.vehIndex].beams.length && lunarSpark.vehicles[potVeh.vehIndex].battery.percent < 99) {
						chosenVehicles.push(potVeh)
					// }
					// else {
					// 	// Determine if a vehicle is low on power
					// 	if (lunarSpark.vehicles[potVeh.vehIndex].battery.percent<50) {  //TODO: use global threshold
					// 		// This will out prioritize already charging vehicles // TODO: prioritize low charges
					// 		chosenVehicles.push(potVeh)
					// 	}
					// }
				}
				// Down select to number of available lasers
				chosenVehicles = chosenVehicles.slice(0,lunarSpark.satellites[i].laser_count); 
			}
			else {
				// All potential vehicles can be chosen so allocate lasers in order

				chosenVehicles = potentialVehicles;
			}
			// Loop through lasers to update connections
			var laserConnectCount = 0;
			for (var j=0;j<lunarSpark.satellites[i].laser_count;j++) {
				// if there is a chosen vehicle
				//if (j<chosenVehicles.length>0) {
					var chosenVeh = chosenVehicles[0];  // set the chosen vehicle to the first entry because % won't work on zero
					if (chosenVehicles.length > 1) {
						chosenVeh = chosenVehicles[j%(chosenVehicles.length-1)]; 
					
						// connect the laser to the vehicle (allow multiple lasers to single vehicle)
						connectLaser(i, j, chosenVeh.vehIndex, chosenVeh.range, chosenVeh.azimuth, chosenVeh.elevation, chosenVeh.diameter, chosenVeh.intensity, chosenVeh.power);  
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
}
function connectLaser(satellite, laser, vehicle, range, azimuth, elevation, diameter, intensity, power) {
	//TODO: how many beams allowed per vehicles should be a function of intensity not arbitary max number
	// TODO: error connecting if satellite is too low on power

	// disconnect laser from old vehicle
	disconnectLaser(satellite, laser);

	// Update satellite data store
	lunarSpark.satellites[satellite].lasers.push({"laser": laser, "vehicle": vehicle, "range": range, "azimuth":azimuth , "elevation": elevation, "diameter": diameter, "intensity": intensity, "power": power });
	// Update vehicle data store
	lunarSpark.vehicles[vehicle].beams.push({"satellite": satellite, "laser": laser, "range": range, "diameter": diameter, "azimuth":azimuth , "elevation": elevation, "intensity": intensity, "power": power});

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
}
function disconnectAllLasers() {
	// For all satellites
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		// for all lasers
		lunarSpark.satellites[i].lasers = [];
	}
	// For all vehicles
	for (var i=0;i<lunarSpark.vehicles.length;i++) {
		// for all beams
		lunarSpark.vehicles[i].beams = []; // empty beams array
	}
}

function calculateBeamCharacteristics(satIndex, vehIndex) {
	var sat = lunarSpark.satellites[satIndex];
	var veh = lunarSpark.vehicles[vehIndex];

	// Calculate beam characteristics
	var {range, azimuth, elevation} = calculateRangeAzimuthElevation(satIndex, vehIndex); // meters deg deg
	var diameter = 2*range * Math.tan(laserBeamDivergenceHalfAngle) + laserBeamInitialDiameter; // meters
	var areaBeam = Math.PI*((diameter/2)**2); 
	var intensity = laserBeamOutputPower/(areaBeam); // TODO: 1kW laser constant
	var power = areaBeam*intensity; // TODO: handle case where beam diameter exceed laser panel dimensions

	return {vehIndex, azimuth, elevation, range, diameter, intensity, power} 
}

function calculateRangeAzimuthElevation(satIndex, vehIndex) {
	var sat = lunarSpark.satellites[satIndex];
	var veh = lunarSpark.vehicles[vehIndex];

	// Calculate satellite coordinates in moon centered inertial frame (x,y,z)
	var satLong = convert360to90(lunarSpark.environment.orbit.ascending_node)*Math.PI/180; // satellite long is related to the ascending node given its in a 90 deg polar orbit
	var satLat = convert360to90(sat.orbit.anomaly)*Math.PI/180; // satellite lat is related to the current position in the orbit (anomaly)
	var satRadius = orbitRadius; // meter
	var satVector = {"x": Math.cos(satLat)*Math.cos(satLong)*satRadius, "y": Math.cos(satLat)*Math.sin(satLong)*satRadius, "z": Math.sin(satLat)*satRadius}

	// Calculate vehicle coordinates in moon centered inertial frame (x,y,z)
	var vehLat = veh.location.lat*Math.PI/180;
	var vehLong = veh.location.long*Math.PI/180;
	var vehRadius = moonRadius; // meters
	var vehVector = {"x": Math.cos(vehLat)*Math.cos(vehLong)*vehRadius, "y": Math.cos(vehLat)*Math.sin(vehLong)*vehRadius, "z": Math.sin(vehLat)*vehRadius}

	// Calculate the vehicle to satellite vector in moon centered inertial frame (x,y,z)
	var rangeVector = {"x": vehVector.x - satVector.x, "y": vehVector.y - satVector.y, "z": vehVector.z - satVector.z,};
	// Calculate the range from vehicle to satellite
	var range = Math.sqrt(rangeVector.x**2 + rangeVector.y**2 + rangeVector.z**2); // meters
	
	// Calculate azimuth and elevation from vehicle to satellite (unit vector)
	var azimuth = Math.atan(rangeVector.y/rangeVector.x)*180/Math.PI; // deg
	var elevation = Math.asin(rangeVector.z/range)*180/Math.PI; // deg

	//console.log("vehIndex:"+vehIndex+" vehLat:"+veh.location.lat+" vehLong:"+veh.location.long+" vehVect x:"+vehVector.x.toFixed(0)+" y:"+vehVector.y.toFixed(0)+" z:"+vehVector.z.toFixed(0));
	//console.log("satIndex:"+satIndex+" satLat:"+convert360to90(sat.orbit.anomaly)+" satLong:"+convert360to90(lunarSpark.environment.orbit.ascending_node)+" satVect x:"+satVector.x.toFixed(0)+" y:"+satVector.y.toFixed(0)+" z:"+satVector.z.toFixed(0));
	console.log("vehIndex:"+vehIndex+" az:"+azimuth.toFixed(2)+" el:"+elevation.toFixed(2)+" range:" + range + " x:"+rangeVector.x.toFixed(0)+" y:"+rangeVector.y.toFixed(0)+" z:"+rangeVector.z.toFixed(0))
	console.log();

	return {range, azimuth, elevation}
}
function convert360to90(angle360) {
	var angle90 = 0;
	if (angle360>=0 && angle360<180) {
		angle90 = 90-angle360;
	}
	else if (angle360>=180 && angle360<360) {
		angle90 = -90+(angle360%180)
	}
	return angle90
}
function convert180to360(angle180) {
	var angle360 = 0;
	if (angle180>=0 && angle180<=180) {
		angle360 = angle180;
	}
	else if (angle180>=-180 && angle180<0) {
		angle360 = (180-angle180)%360
	}
	return angle360
}