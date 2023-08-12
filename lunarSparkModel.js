// Save initial data to local storage for later recovery
localStorage.setItem("lunarSparkInput", JSON.stringify(lunarSparkInput));

// Set initial values from input configuration file (global)
var lunarSpark =  JSON.parse(localStorage.getItem("lunarSparkInput"));

// Lunar constants 
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
// http://astro.dur.ac.uk/~ams/users/lunar_sid_syn.html
// (TODO: check dayPerLunarCycle agains HSF lecture 04 slide 37 13.5 deg per day - may need 28 days)
// (TODO: check dayPerLunarCycle agains HSF lecture 27-28 chart 13

const minPerDay = 60*24; // minutes per day (earth)
// SpaceTech2022-ST-22-23-Serie-Introduction-to-Lunar-Transfer-Problem.pdf slide 31
const daysPerSinodicLunarCycle = 29.53; // earth days per lunar cycle with respect to sun - https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
const daysPerSidrealLunarCycle = 27.32; // earth days per lunar cycle with respect to orbit - https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
const minPerSinodicLunarCycle = daysPerSinodicLunarCycle*minPerDay;
const minPerSidrealLunarCycle = daysPerSidrealLunarCycle*minPerDay;

const sunAngleDegreesPerMinute = 360/minPerSinodicLunarCycle; // deg per min respect to sun
const ascendingNodeDegreesPerMinute = 360/minPerSidrealLunarCycle; // deg per min respect to orbit
const solarFluxInLunarOrbit = 1361; // W/m2 - https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
const moonRadius = 1736000; // meters - https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
const moonMu = 4900000000000 // m^3/sec^2  - https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
const eclipseTime = 45.42 // min SMAD solar array

// Orbit constants
const orbitRadius = moonRadius + lunarSpark.environment.orbit.altitude; // meters

function stepModel() { 
	updateSunAngle();
	updateAscendingNode();
	updateVehicles();
	updateSatellites();
	connectLasers();
	logData();
}

function updateSunAngle () {
	lunarSpark.environment.sun_angle = (360+lunarSpark.environment.sun_angle-(timeStep*sunAngleDegreesPerMinute))%360;
}
function updateAscendingNode () {
	lunarSpark.environment.orbit.ascending_node = (360+lunarSpark.environment.orbit.ascending_node-(timeStep*ascendingNodeDegreesPerMinute))%360;
	lunarSpark.environment.orbit.count = Math.floor(time/lunarSpark.environment.orbit.period);
}
function updateSatellites () {
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		var sat = lunarSpark.satellites[i]

		// Update orbit position and min
		sat.orbit.min = (sat.orbit.min+timeStep)%lunarSpark.environment.orbit.period;
		sat.orbit.anomaly = sat.orbit.min/lunarSpark.environment.orbit.period*360;
		
 		// if anomaly is greater than 180 then flip to the other side of the longitude
 		if (sat.orbit.anomaly >= 0 && sat.orbit.anomaly < 180) { // TODO: fix 360 should be 0 issue
 			// satellite long is directly related to the ascending node given its in a 90 deg polar orbit
 		   	sat.orbit.long = lunarSpark.environment.orbit.ascending_node //deg 0 - 180
 		}
 		else {
 			// satellite is on the other side of orbit so flip the longitude
			sat.orbit.long = (lunarSpark.environment.orbit.ascending_node + 180)%360; // deg 180 - 360
 		}

    	// satellite lat is related to the current position in the orbit (anomaly)
    	sat.orbit.lat = convert360to90(sat.orbit.anomaly) // deg

		// Update range/az/elev to each vehicle 
		for (var k=0;k<lunarSpark.vehicles.length;k++) {
			if (lunarSpark.vehicles[k].active) {
				var {vehIndex, range, azimuth, elevation, rxArea, intensity, power} = calculateBeamCharacteristics(i,k);
				sat.vehicles[k] = {"id": vehIndex, "range": range, "azimuth": azimuth, "elevation": elevation, "rxArea": rxArea, "intensity": intensity, "power": power};
			}
			else {
				sat.vehicles[k] = {"id": "---", "range": 0, "azimuth": 0, "elevation": 0, "rxArea": 0, "intensity": 0, "power": 0};
			}
		}	
		// TODO: inEclipse(sat)
		const eclipseFactor = (lunarSpark.environment.orbit.period - eclipseTime) / lunarSpark.environment.orbit.period

		// Update Power Production
		sat.solar_panel.power_output = sat.solar_panel.area * lunarSpark.system.satellite.solar_panel_eff * solarFluxInLunarOrbit * eclipseFactor; // Watts 

		// Update Power Storage
		// if the solar panel is producing power
		if (sat.solar_panel.power_output>0) {
			// if charge is less than full
			if (sat.battery.charge < sat.battery.capacity) {
				// add the power provided for this time step to the battery (dont include eps efficiency, take on the way out of batt)
				sat.battery.charge = sat.battery.charge + (sat.solar_panel.power_output * timeStep/60 ); // Watt*h
				// limit charge to maximum capacity
				if (sat.battery.charge > sat.battery.capacity) {
					sat.battery.charge = sat.battery.capacity;
				}
			}
		}

		// Update Satellite/Laser Power Draw
		// draw the power for this time step from the battery (eps efficiency taken on the way out of the battery) 
		// satellite power draw
		sat.battery.charge = sat.battery.charge - ((sat.sat_power_draw/lunarSpark.system.satellite.eps_eff)*timeStep/60) // Watt*h
		// laser power draw x the duty cycle
		sat.battery.charge = sat.battery.charge - ((sat.laser_power_draw/lunarSpark.system.satellite.eps_eff)*lunarSpark.system.satellite.laser_duty_cycle*timeStep/60); // Watt*h		
		sat.cumulative_laser_energy_draw += ((sat.laser_power_draw/lunarSpark.system.satellite.eps_eff)*lunarSpark.system.satellite.laser_duty_cycle*timeStep/60); // Watt*h	
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
			if (!veh.location.in_night && !veh.location.in_shadow) {
				// Update solar panel power production
				veh.solar_panel.power_output = veh.solar_panel.height*veh.solar_panel.width * lunarSpark.system.vehicle.solar_panel_eff * solarFluxInLunarOrbit ; // Watts 
			}
			else {
				// In lunar night so no solar panel power output
				veh.solar_panel.power_output = 0;
			}

			// Update laser panel output power
			// Loop through vehicle beams and total the power
			var laserPanelPwr = 0;
			for (var j=0;j<veh.beams.length;j++) {
				// Update solar panel power production (efficiency applied to power calculation)
				laserPanelPwr = laserPanelPwr + veh.beams[j].power; // Watts 
			}
			// Update laser panel power production
			veh.laser_panel.power_output = laserPanelPwr;
			veh.cumulative_laser_panel_energy += laserPanelPwr* timeStep/60; // Watt*h

			// Update solar/laser power storage 
			var totalPwrGenerated = veh.solar_panel.power_output + veh.laser_panel.power_output
			// if the solar/laser panel is producing power
			if (totalPwrGenerated > 0) {
				// if charge is less than full
				if (veh.battery.charge < veh.battery.capacity) {
					// add the power provided for this time step to the battery (dont include eps efficiency, this is taken on the way out)
					veh.battery.charge = veh.battery.charge + (totalPwrGenerated * timeStep/60); // Watt*h
					// limit charge to maximum capacity
					if (veh.battery.charge > veh.battery.capacity) {
						// track excess power generated by the laser panel (excesss)
						if (veh.laser_panel.power_output) {
							veh.excess_laser_panel_energy += veh.battery.charge - veh.battery.capacity
						}
						veh.battery.charge = veh.battery.capacity;
					}
				}
			}

			// Update Vehicle Power Draw 
			// draw the power for this time step from the battery (eps efficiency taken on the way out of the battery)
			veh.battery.charge = veh.battery.charge - ((veh.power_draw/lunarSpark.system.vehicle.eps_eff)*timeStep/60.0); // Watt*h		
			// if battery charge is negative set to zero
			if (veh.battery.charge < 0) {
				veh.battery.charge = 0;
			}

			// Update vehicle battery percentage
			veh.battery.percent = (veh.battery.charge/veh.battery.capacity)*100; // %

			// Update Time to Live
			veh.ttl = veh.battery.charge/(veh.power_draw/lunarSpark.system.vehicle.eps_eff)*60; // min  // conider eps efficiency
			veh.ttl_percent = veh.ttl / (veh.battery.capacity/(veh.power_draw/lunarSpark.system.vehicle.eps_eff)*60)*100 // %
			if (veh.ttl < lunarSpark.test_case.ttl_threshold) {
				veh.ttl_below_threshold += timeStep
			}
			if (veh.ttl == 0) {
				veh.ttl_below_zero += timeStep
			}

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

function getPotentialVehicles(i) {
	var potentialVehicles = [];
	// Loop through vehicles
	for (var k=0;k<lunarSpark.vehicles.length;k++) {
		if (lunarSpark.vehicles[k].active) {
			// Determine beam characteristics for this vehicle
			var {vehIndex, range, azimuth, elevation, rxArea, intensity, power} = calculateBeamCharacteristics(i,k);
			// If the vehicle is in the line of sight (elevation)
			if (elevation >= lunarSpark.system.vehicle.laser_panel_min_elevation) { // TODO: consider shadow model (needs azimuth)
				potentialVehicles.push({vehIndex, range, azimuth, elevation, rxArea, intensity, power});
			}
		}
	}
	return potentialVehicles
}

function vehicleSort(a,b){
	var test = 0

	// prefer active vehicles regardless of anything else
	if (a.active != b.active) {
		test = b.active - a.active
	}	
	// prefer low ttl over higher
	else { 
		//test = a.battery.percent - b.battery.percent 
		test = a.ttl - b.ttl
		//test = a.ttl_pred - b.ttl_pred
	}
	return test
}

function updateSatelliteDatastore(sat) {
	var vehData = [...lunarSpark.vehicles]
	// predict key factors for next orbit approach
	for (var i=0;i<vehData.length;i++) {
		vehData[i].battery_charge_pred = (vehData[i].battery.charge - vehData[i].power_draw*lunarSpark.environment.predict_time/60) // (Wh - Wh) 
		vehData[i].ttl_pred = (vehData[i].battery_charge_pred / vehData[i].power_draw) * 60 // (Wh) / W
		vehData[i].battery_available_pred = vehData[i].battery.capacity - vehData[i].battery_charge_pred // Wh
	}
	return [...vehData]
}

function chooseVehicle(sat) {
	
	// sort to prioritize vehicles based on chosen method
	var prioritizedVehicles = [...lunarSpark.satellites[sat].vehData]
	prioritizedVehicles.sort(vehicleSort)
	
	// loop through prioritized vehicles and disqualify vehicles until one is choosen 
	var chosenVehicleIndex = -1
	var executeDelivery = true

	for (var i=0;i<prioritizedVehicles.length;i++) {
		if (prioritizedVehicles[i].active == true) { 

			// if the vehicle is in the dark (prevent delivery in the light)
			if (prioritizedVehicles[i].location.in_shadow == true || prioritizedVehicles[i].location.in_night == true) { 
			
				// if battery capacity is really small or the charge is low enough to take a full beam (prevent excess delivery)
				if ((prioritizedVehicles[i].battery.capacity < lunarSpark.environment.small_capacity) ||				
					 (prioritizedVehicles[i].battery.capacity - 
						(prioritizedVehicles[i].battery.charge - prioritizedVehicles[i].power_draw*lunarSpark.environment.predict_time/60) > lunarSpark.environment.adequate_capacity)) {

					// if the ttl pred indicates the veh will be alive for the next power delivery opportunity 
					if (prioritizedVehicles[i].ttl - lunarSpark.environment.chance_to_live > 0) {
						var chosenVehicleIndex = lunarSpark.satellites[sat].vehData.indexOf(prioritizedVehicles[i])
						break;
					}
					else {
						console.log("Chance to Live:(TTL))", prioritizedVehicles[i].ttl)
					}
				}
				else {
					console.log("Adquate Capacity:(small battery)",prioritizedVehicles[i].battery.capacity)
					console.log("Adquate Capacity:(capacity))",(prioritizedVehicles[i].battery.charge - prioritizedVehicles[i].power_draw*lunarSpark.environment.predict_time/60))
				}
			}
			else {
				console.log("In Dark:",prioritizedVehicles[i].location.in_shadow, prioritizedVehicles[i].location.in_night)
			}
		}
	}
	// if no vehicle was chosen (all disqualified) 
	if (chosenVehicleIndex < 0) {
		// indicate to not actually deliver power (just calculate undelivered capacity) 
		executeDelivery = false
		// choose the highest priority to accumulate undelivered capacity
		chosenVehicleIndex = lunarSpark.satellites[sat].vehData.indexOf(prioritizedVehicles[0])		
	}
	return {"index": chosenVehicleIndex, "deliver": executeDelivery}
}

function connectLasers() {
	// Loop through satellites and vehicle and
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		if (lunarSpark.satellites[i].active) {
				
			var laserConnectCount = 0;
			// if satellite is departing the southern hemisphsere perform vehicle selection using latest information
			var anomaly = lunarSpark.satellites[i].orbit.anomaly;
			// TODO:  add these numbers to comfig
			if (anomaly > 200 && anomaly < 215) {
				lunarSpark.satellites[i].vehData = updateSatelliteDatastore(i)
      			lunarSpark.satellites[i].chosen_vehicle = chooseVehicle(i);
			}
			// satellite has chosen a target vehicle so check for vehicle
			else { 
				//if (lunarSpark.vehicles[lunarSpark.satellites[i].chosen_vehicle].in_night) {
					var potentialVehicles = getPotentialVehicles(i);
					// if the chosen vehicle is a potential vehicle
					for (var j=0;j<potentialVehicles.length;j++) {
						if (lunarSpark.satellites[i].chosen_vehicle.index == potentialVehicles[j].vehIndex) {
							// connect the laser to the vehicle
							laserConnectCount += connectLaser(lunarSpark.satellites[i].chosen_vehicle.deliver, i, 0, potentialVehicles[j].vehIndex, potentialVehicles[j].range, potentialVehicles[j].azimuth, potentialVehicles[j].elevation, potentialVehicles[j].rxArea, potentialVehicles[j].intensity, potentialVehicles[j].power);  
						}
						// TODO: choose new vehicle and try again until there is no more options to choose (return undelivered power from connectLaser)
						// lunarSpark.satellites[satellite].cumulative_undelivered_laser_capacity += power*timeStep/60 // Whr
					}
				//}
			}
			if (laserConnectCount == 0) {
				// otherwise disconnect the laser
				disconnectLaser(i,0, true);
			}
			
			// laser power draw includes efficiency (duty cycle included on the battery draw calculation)
			lunarSpark.satellites[i].laser_power_draw = laserConnectCount*lunarSpark.system.satellite.laser_output_power/lunarSpark.system.satellite.laser_eff; 
			lunarSpark.satellites[i].cumulative_laser_energy_output += laserConnectCount*lunarSpark.system.satellite.laser_output_power*timeStep/60 // Watt*h 
		}
	}
}
function connectLaser(executeDelivery, satellite, laser, vehicle, range, azimuth, elevation, rxArea, intensity, power) {
	// TODO: error connecting if satellite is too low on power

	laserConnectCount = 0


	// check vehicle for non-delivery criteria
	// if a vehicle was chosen for delivery and the vehicle is in the dark and vehicle is alive
	if (executeDelivery && (lunarSpark.vehicles[vehicle].location.in_shadow == true || lunarSpark.vehicles[vehicle].location.in_night == true) &&
		(lunarSpark.vehicles[vehicle].ttl > 0)) {
		// disconnect laser from old vehicle
		disconnectLaser(satellite, laser, false);
		// Update satellite data store
		lunarSpark.satellites[satellite].lasers.push({"laser": laser, "vehicle": vehicle, "range": range, "azimuth":azimuth , "elevation": elevation, "rxArea": rxArea, "intensity": intensity, "power": power });
		// Update vehicle data store
		lunarSpark.vehicles[vehicle].beams.push({"satellite": satellite, "laser": laser, "range": range, "rxArea": rxArea, "azimuth":azimuth , "elevation": elevation, "intensity": intensity, "power": power});
		laserConnectCount = 1
		// set start time for metrics and zero the last beam energy to start accumulating
		if (lunarSpark.satellites[satellite].beam_metrics.start_time == -1) {
			lunarSpark.satellites[satellite].beam_metrics.start_time = time
			lunarSpark.vehicles[vehicle].beam_metrics.last_beam_energy = power*timeStep/60 // Whr
		}
		// capture power delivery metrics for this beam for this step
		else {
			lunarSpark.vehicles[vehicle].beam_metrics.last_beam_energy += power*timeStep/60 // Wh
		}
	}
	// no vehicle was chosen or the vehicle cancelled the transmission
	else { 
		// disconnect laser from old vehicle
		disconnectLaser(satellite, laser, true);
		lunarSpark.satellites[satellite].cumulative_undelivered_laser_capacity += power*timeStep/60 // Whr
	}	

	// if more than maxBeamsPerVehicle report a message TODO: reword error message
	if (lunarSpark.vehicles[vehicle].beams.length > maxBeamsPerVehicle) {
		console.log("More beams connected than can be displayed.  Consider expanding maxBeamsPerVehicle.")
	}
	return laserConnectCount
}
function disconnectLaser(satellite, laser, stopBeamTime) {
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
	// calculate beam duration
	if (stopBeamTime && sat.beam_metrics.start_time != -1) {
		sat.beam_metrics.last_beam = time - sat.beam_metrics.start_time
		if (sat.beam_metrics.beam_count == 0) {
			sat.beam_metrics.min_beam = sat.beam_metrics.last_beam
			sat.beam_metrics.max_beam = sat.beam_metrics.last_beam
			sat.beam_metrics.avg_beam = sat.beam_metrics.last_beam
		}
		else {
			if (sat.beam_metrics.min_beam > sat.beam_metrics.last_beam) { sat.beam_metrics.min_beam = sat.beam_metrics.last_beam}
			if (sat.beam_metrics.max_beam < sat.beam_metrics.last_beam) { sat.beam_metrics.max_beam = sat.beam_metrics.last_beam}
			sat.beam_metrics.avg_beam = (sat.beam_metrics.avg_beam*sat.beam_metrics.beam_count +sat.beam_metrics.last_beam)/(sat.beam_metrics.beam_count+1)
		}
		sat.beam_metrics.beam_count += 1
		sat.beam_metrics.start_time = -1

		// capture beam energy metrics
		if (lunarSpark.vehicles[veh].beam_metrics.beam_count == 0) {
			lunarSpark.vehicles[veh].beam_metrics.min_beam_energy = lunarSpark.vehicles[veh].beam_metrics.last_beam_energy
			lunarSpark.vehicles[veh].beam_metrics.max_beam_energy = lunarSpark.vehicles[veh].beam_metrics.last_beam_energy
			lunarSpark.vehicles[veh].beam_metrics.avg_beam_energy = lunarSpark.vehicles[veh].beam_metrics.last_beam_energy
		}
		else {
			if (lunarSpark.vehicles[veh].beam_metrics.min_beam_energy > lunarSpark.vehicles[veh].beam_metrics.last_beam_energy) { lunarSpark.vehicles[veh].beam_metrics.min_beam_energy = lunarSpark.vehicles[veh].beam_metrics.last_beam_energy}
			if (lunarSpark.vehicles[veh].beam_metrics.max_beam_energy < lunarSpark.vehicles[veh].beam_metrics.last_beam_energy) { lunarSpark.vehicles[veh].beam_metrics.max_beam_energy = lunarSpark.vehicles[veh].beam_metrics.last_beam_energy}
			lunarSpark.vehicles[veh].beam_metrics.avg_beam_energy = (lunarSpark.vehicles[veh].beam_metrics.avg_beam_energy*lunarSpark.vehicles[veh].beam_metrics.beam_count +lunarSpark.vehicles[veh].beam_metrics.last_beam_energy)/(lunarSpark.vehicles[veh].beam_metrics.beam_count+1)
		}
		lunarSpark.vehicles[veh].beam_metrics.beam_count += 1
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

	//  divergence half angle: θ = wavelength / (pi * w0) w0 is a radius
	var divergenceHalfAngle = lunarSpark.system.satellite.laser_wavelength/(Math.PI*(lunarSpark.system.satellite.laser_output_diameter/2))
	// Beam diameter at range D(range) = 2 * range * tan(θ/2) + D0
	var beamDiameter = 2 * range * Math.tan(divergenceHalfAngle) + lunarSpark.system.satellite.laser_output_diameter; // meters
	//var beamDiameter = lunarSpark.system.satellite.laser_output_diameter // meters
	var areaBeam = Math.PI*((beamDiameter/2)**2); 
	var receiverDiameter = lunarSpark.vehicles[vehIndex].laser_panel.diameter;
	// Area of the ellipse created due to elevation
	var rxArea = Math.PI*((receiverDiameter/2)**2)*Math.cos((90-elevation)*Math.PI/180); 
	// Laser output constant x duty cycle with no space loss from output to panel
	var intensity = lunarSpark.system.satellite.laser_output_power*lunarSpark.system.satellite.laser_duty_cycle/(areaBeam); // W/m2 
	// Assume beam always covers the whole panel (pointing error accomodated by beam width)
	// Apply laser panel efficiency
	var power = rxArea*intensity*lunarSpark.system.vehicle.laser_panel_eff; 
	return {vehIndex, azimuth, elevation, range, rxArea, intensity, power} 
}

function calculateRangeAzimuthElevation(satIndex, vehIndex) {
	var sat = lunarSpark.satellites[satIndex];
	var veh = lunarSpark.vehicles[vehIndex];
	
	// // Calculate satellite coordinates in moon centered inertial frame (x,y,z)
	// var satLong = convert360to90(lunarSpark.environment.orbit.ascending_node)*Math.PI/180; // satellite long is related to the ascending node given its in a 90 deg polar orbit
	// var satLat = convert360to90(sat.orbit.anomaly)*Math.PI/180; // satellite lat is related to the current position in the orbit (anomaly)
	// var satRadius = orbitRadius; // meter
	// var satVector = {"x": Math.cos(satLat)*Math.cos(satLong)*satRadius, "y": Math.cos(satLat)*Math.sin(satLong)*satRadius, "z": Math.sin(satLat)*satRadius}

	// // Calculate vehicle coordinates in moon centered inertial frame (x,y,z)
	// var vehLat = veh.location.lat*Math.PI/180;
	// var vehLong = veh.location.long*Math.PI/180;
	// var vehRadius = moonRadius; // meters
	// var vehVector = {"x": Math.cos(vehLat)*Math.cos(vehLong)*vehRadius, "y": Math.cos(vehLat)*Math.sin(vehLong)*vehRadius, "z": Math.sin(vehLat)*vehRadius}

	// // Calculate the vehicle to satellite vector in moon centered inertial frame (x,y,z)
	// var rangeVector = {"x": vehVector.x - satVector.x, "y": vehVector.y - satVector.y, "z": vehVector.z - satVector.z,};
	// // Calculate the range from vehicle to satellite
	// var range = Math.sqrt(rangeVector.x**2 + rangeVector.y**2 + rangeVector.z**2); // meters
	
	// // Calculate azimuth and elevation from vehicle to satellite (unit vector)
	// var azimuth = Math.atan(rangeVector.y/rangeVector.x)*180/Math.PI; // deg
	// var elevation = Math.asin(rangeVector.z/range)*180/Math.PI; // deg

	var satLat = sat.orbit.lat * Math.PI/180; // rad
	var satLong = sat.orbit.long * Math.PI/180; // rad
	var satRadius = orbitRadius; // meters

	var vehLat = veh.location.lat*Math.PI/180;
	var vehLong = veh.location.long*Math.PI/180;
	var vehRadius = moonRadius; // meters
	
	// SMAD Section 5.2 Example
	// satLat = 10*Math.PI/180
	// satLong = 185*Math.PI/180
	// vehLat = 22*Math.PI/180
	// vehLong = 200*Math.PI/180
	// vehRadius = 6378000 // example uses earth radius
	// satRadius = 7378000

	// Calculate lamba angle between sub-satellite lat/long center of moon and veh lat/log (SMAD 5-10)
	var lamda = Math.acos((Math.sin(satLat)*Math.sin(vehLat) + Math.cos(satLat)*Math.cos(vehLat)*Math.cos(Math.abs(satLong-vehLong)))) //rad
	// Calculate rho angle between sub-satellite lat/long center of moon and line-of-sight horizong for satellite (SMAD5-13)
	var rho = Math.asin(vehRadius/satRadius) // rad
	// Calculate nadir angle from sub-satellite point to satellite to vehicle (SMAD 5-14)
	var nadirAngle = Math.atan(Math.sin(rho)*Math.sin(lamda)/(1-(Math.sin(rho)*Math.cos(lamda)))) // rad
	// Calculate range (SMAD 5-15b)
	var range = lunarSpark.environment.orbit.altitude;  // if nadir is zero return satellite altitude
	if (nadirAngle != 0) {
		range = vehRadius * Math.sin(lamda)/Math.sin(nadirAngle) // meters
	}

// 'use strict';

// function toDegrees(radians) {
//   return radians * 180 / Math.PI;
// }

// omni.define('azimuth', function(lat1, lat2, lon1, lon2) {
//   lat1 = lat1.toNumber();
//   lat2 = lat2.toNumber();
//   lon1 = lon1.toNumber();
//   lon2 = lon2.toNumber();

//   var R = 6371e3;
//   var phi = (lat2-lat1);
//   var lambda = (lon2-lon1);

//   var a = (Math.sin(phi /2) * Math.sin(phi /2)) + (Math.cos(lat1) * Math.cos(lat2) * Math.sin(lambda/2) * Math.sin(lambda/2));
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   var d = R*c;
//   return d;
// });

// omni.define('bearing', function(lat1, lat2, lon1, lon2) {
//   lat1 = lat1.toNumber();
//   lat2 = lat2.toNumber();
//   lon1 = lon1.toNumber();
//   lon2 = lon2.toNumber();
//   var y = Math.sin(lon2-lon1) * Math.cos(lat2);
//   var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
//   var brng = toDegrees(Math.atan2(y, x));
//   brng =  ( (brng+360) % 360);
//   return brng;
// });
// //# sourceURL=https://www.omnicalculator.com/customjs/azimuth.js

	var y = Math.sin(satLong-vehLong) * Math.cos(satLat);
	var x = Math.cos(vehLat)*Math.sin(satLat) - Math.sin(vehLat)*Math.cos(satLat)*Math.cos(satLong-vehLong);
	var brng = (Math.atan2(y, x));
	brng = brng*180/Math.PI;
	brng =  ( (brng+360) % 360);
	var azimuth = brng;

	// // Calculate azimuth (SMAD 5-11) TODO: https://www.omnicalculator.com/other/azimuth
	// var azimuth = 0;
	// // protect for divide by zero when satellite is directly overhead (lambda = 0) or passing over the poles (satLat = +/- PI/2)
	// if (lamda !=0 && Math.sin(lamda) != 0 && Math.cos(satLat) != 0) {
	// 	var operation = (Math.sin(vehLat)-(Math.cos(lamda)*Math.sin(satLat))) / (Math.sin(lamda)*Math.cos(satLat))
	// 	azimuth = Math.acos( operation.toFixed(3) )
	// }
	// else {
	// 	azimuth = 0;		
	// }
	// azimuth = azimuth*180/Math.PI // deg
	// // switch to vehicle perspective
	// //azimuth = (azimuth+180)%360

	// Calculate elevation (SMAT 5-15a)
	var elevation = 90*Math.PI/180 - nadirAngle - lamda // rad
	elevation = elevation*180/Math.PI // deg

	//console.log("vehIndex:"+vehIndex+" vehLat:"+veh.location.lat+" vehLong:"+veh.location.long+" vehVect x:"+vehVector.x.toFixed(0)+" y:"+vehVector.y.toFixed(0)+" z:"+vehVector.z.toFixed(0));
	// console.log("satIndex:"+satIndex+" satLat:"+(sat.orbit.lat).toFixed(0)+" satLong:"+sat.orbit.long.toFixed(0)) // +" satVect x:"+satVector.x.toFixed(0)+" y:"+satVector.y.toFixed(0)+" z:"+satVector.z.toFixed(0));
	// console.log("vehIndex:"+vehIndex+" vehLat:"+veh.location.lat.toFixed(0)+" vehLong:"+veh.location.long+" az:" +(azimuth).toFixed(2)+" el:"+(elevation).toFixed(2)+" range:" + (range/1000).toFixed(0)) // + " x:"+rangeVector.x.toFixed(0)+" y:"+rangeVector.y.toFixed(0)+" z:"+rangeVector.z.toFixed(0))
	// console.log("lmd(18.73): "+(lamda).toFixed(2) + " rho(59.82):"+  (rho).toFixed(2) + 
	//  	" nadirAngle(56.85):"+ (nadirAngle).toFixed(2) + " az(48.35):"+(azimuth).toFixed(2) +
	//  	" el(14.42):"+(elevation).toFixed(2)+" range(2446):" + (range/1000).toFixed(0))
	// console.log();

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
	if (angle180>=0) { // works if 360 deg system is used as well
		angle360 = angle180;
	}
	else if (angle180>=-180 && angle180<0) {
		angle360 = (180-angle180)%360
	}
	return angle360
}