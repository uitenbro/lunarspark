// Save initial data to local storage for later recovery
localStorage.setItem("lunarSparkInput", JSON.stringify(lunarSparkInput));

// Set initial values from input configuration file (global)
var lunarSpark =  JSON.parse(localStorage.getItem("lunarSparkInput"));

// Lunar constants
const minPerDay = 60*24; // minutes per day (earth)
// (TODO: check dayPerLunarCycle agains HSF lecture 04 slide 37 13.5 deg per day - may need 28 days)
// (TODO: check dayPerLunarCycle agains HSF lecture 27-28 chart 13
const daysPerLunarCycle = 29.5; // earth days per lunar cycle with respect to sun 
const minPerLunarCycle = daysPerLunarCycle*minPerDay;
const sunAngleDegreesPerMinute = 360/minPerLunarCycle; // deg per min
const ascendingNodeDegreesPerMinute = 360/minPerLunarCycle; // deg per min
const solarFluxInLunarOrbit = 1373; // W/m2
const moonRadius = 1740000; // meters

// Orbit constants
const orbitRadius = moonRadius + lunarSpark.environment.orbit.altitude; // meters

function stepModel() { 
	updateSunAngle();
	updateAscendingNode();
	updateVehicles();
	updateSatellites();
	connectLasers();
}

function updateSunAngle () {
	lunarSpark.environment.sun_angle = (lunarSpark.environment.sun_angle+(timeStep*sunAngleDegreesPerMinute))%360;
}
function updateAscendingNode () {
	lunarSpark.environment.orbit.ascending_node = (lunarSpark.environment.orbit.ascending_node+(timeStep*ascendingNodeDegreesPerMinute))%360;
	lunarSpark.environment.orbit.count = Math.floor(time/lunarSpark.environment.orbit.period);
}
function updateSatellites () {
	for (var i=0;i<lunarSpark.satellites.length;i++) {
		var sat = lunarSpark.satellites[i]

		// Update orbit position and count
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

		// Update Power Production
		sat.solar_panel.power_output = sat.solar_panel.area * lunarSpark.system.satellite.solar_panel_eff * solarFluxInLunarOrbit ; // Watts 

		// Update Power Storage
		// if the solar panel is producing power
		if (sat.solar_panel.power_output>0) {
			// if charge is less than full
			if (sat.battery.charge < sat.battery.capacity) {
				// add the power provided for this time step to the battery (include eps efficiency)
				sat.battery.charge = sat.battery.charge + (sat.solar_panel.power_output * timeStep/60 * lunarSpark.system.satellite.eps_eff); // Watt*h
				// limit charge to maximum capacity
				if (sat.battery.charge > sat.battery.capacity) {
					sat.battery.charge = sat.battery.capacity;
				}
			}
		}

		// Update Satellite/Laser Power Draw
		// draw the power for this time step from the battery (eps efficiency taken on the way into the battery)
		sat.battery.charge = sat.battery.charge - (sat.sat_power_draw*timeStep/60) - (sat.laser_power_draw*timeStep/60); // Watt*h		
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
				// If a beam is connected
				// if (typeof(veh.beams[j]) !== "undefined") {
				// 	if (veh.beams[j].laser != "-") {
						// Update solar panel power production
						laserPanelPwr = laserPanelPwr + veh.beams[j].power*lunarSpark.system.vehicle.laser_panel_eff; // Watts 
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
					veh.battery.charge = veh.battery.charge + (totalPwrGenerated * timeStep/60 * lunarSpark.system.vehicle.eps_eff); // Watt*h
					// limit charge to maximum capacity
					if (veh.battery.charge > veh.battery.capacity) {
						veh.battery.charge = veh.battery.capacity;
					}
				}
			}

			// Update Vehicle Power Draw 
			// draw the power for this time step from the battery (eps efficiency taken on the way into the battery)
			veh.battery.charge = veh.battery.charge - (veh.power_draw*timeStep/60.0); // Watt*h		
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
					var {vehIndex, range, azimuth, elevation, rxArea, intensity, power} = calculateBeamCharacteristics(i,k);
					// If the vehicle is in the line of sight (elevation)
					if (elevation > 12) { // TODO: consider shadow model (needs azimuth)
						// If vehicle is in the lunar night 
						if (lunarSpark.vehicles[k].location.in_night) {	
							//if (current beam intensity + new beam intesity) < max intensity {
							potentialVehicles.push({vehIndex, range, azimuth, elevation, rxArea, intensity, power});
						}
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
					if (chosenVehicles.length == 1){
						// connect the laser to the vehicle (allow multiple lasers to single vehicle)
						connectLaser(i, j, chosenVeh.vehIndex, chosenVeh.range, chosenVeh.azimuth, chosenVeh.elevation, chosenVeh.rxArea, chosenVeh.intensity, chosenVeh.power);  
						laserConnectCount++;
					}
					else if (chosenVehicles.length > 1) {
						chosenVeh = chosenVehicles[j%(chosenVehicles.length)]; 
					
						// connect the laser to the vehicle (allow multiple lasers to single vehicle)
						connectLaser(i, j, chosenVeh.vehIndex, chosenVeh.range, chosenVeh.azimuth, chosenVeh.elevation, chosenVeh.rxArea, chosenVeh.intensity, chosenVeh.power);  
						laserConnectCount++;
					}
					else {
						// otherwise disconnect the laser
						disconnectLaser(i,j);
					}
			}
			// TODO: confirm 20% efficiency to produce 1kW
			lunarSpark.satellites[i].laser_power_draw = laserConnectCount*lunarSpark.system.satellite.laser_output_power/lunarSpark.system.satellite.laser_eff; 
		}
	}
}
function connectLaser(satellite, laser, vehicle, range, azimuth, elevation, rxArea, intensity, power) {
	//TODO: how many beams allowed per vehicles should be a function of intensity not arbitary max number
	// TODO: error connecting if satellite is too low on power

	// disconnect laser from old vehicle
	disconnectLaser(satellite, laser);

	// Update satellite data store
	lunarSpark.satellites[satellite].lasers.push({"laser": laser, "vehicle": vehicle, "range": range, "azimuth":azimuth , "elevation": elevation, "rxArea": rxArea, "intensity": intensity, "power": power });
	// Update vehicle data store
	lunarSpark.vehicles[vehicle].beams.push({"satellite": satellite, "laser": laser, "range": range, "rxArea": rxArea, "azimuth":azimuth , "elevation": elevation, "intensity": intensity, "power": power});

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
	// TODO: This is a potential beam (it may not be achieveable due to line of site)
	// TODO: if beam is not columnated then need divergence half angle
	//var diameter = 2*range * Math.tan(lunarSpark.system.satellite.laser_divergence_half_angle) + lunarSpark.system.satellite.laser_output_diameter; // meters
	var beamDiameter = lunarSpark.system.satellite.laser_output_diameter // meters
	var areaBeam = Math.PI*((beamDiameter/2)**2); 
	var receiverDiameter = lunarSpark.vehicles[vehIndex].laser_panel.diameter;
	var rxArea = Math.PI*((receiverDiameter/2)**2)*Math.cos((90-elevation)*Math.PI/180); // area of the ellipse created due to elevation TODO:  Not correct
	var intensity = lunarSpark.system.satellite.laser_output_power/(areaBeam); // W/m2 (laser output constant no space loss from output to panel)
	var power = rxArea*intensity; // Assume beam always covers the whole panel (pointing error accomodated by beam width)

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
	// console.log("lmd(18.73): "+(lamda*180/Math.PI).toFixed(2) + " rho(59.82):"+  (rho*180/Math.PI).toFixed(2) + 
	//  	" nadirAngle(56.85):"+ (nadirAngle*180/Math.PI).toFixed(2) + " az(48.35):"+(azimuth).toFixed(2) +
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