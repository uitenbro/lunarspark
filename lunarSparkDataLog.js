function initializeDataLog() {
	// Environment
	lunarSpark.environment.time_history = []
	lunarSpark.environment.sun_angle_history = []
	lunarSpark.environment.orbit.count_history = []
    lunarSpark.environment.orbit.ascending_node_history = []

	// Satellite
    for (var i=0;i<lunarSpark.satellites.length;i++) {
		lunarSpark.satellites[i].orbit.anomaly_history = []
	    lunarSpark.satellites[i].orbit.lat_history = []
	    lunarSpark.satellites[i].orbit.long_history = []
	    lunarSpark.satellites[i].orbit.min_history = []
	    lunarSpark.satellites[i].battery.percent_history = []
	    lunarSpark.satellites[i].battery.charge_history = []
	    lunarSpark.satellites[i].solar_panel.power_output_history = []    
	   	lunarSpark.satellites[i].laser_power_draw_duty_cycle_history = [] 
	   	lunarSpark.satellites[i].cumulative_laser_energy_draw_history = [] 
	   	lunarSpark.satellites[i].cumulative_laser_energy_output_history = []      
	   	lunarSpark.satellites[i].cumulative_undelivered_laser_capacity_history = []      
	}

	// Vehicle
	for (var i=0;i<lunarSpark.vehicles.length;i++) {
		lunarSpark.vehicles[i].battery.percent_history = []
		lunarSpark.vehicles[i].battery.charge_history = []
		lunarSpark.vehicles[i].solar_panel.power_output_history = []
		lunarSpark.vehicles[i].laser_panel.power_output_history = []
		lunarSpark.vehicles[i].laser_panel.excess_laser_panel_energy_history = []
		lunarSpark.vehicles[i].laser_panel.cumulative_laser_panel_energy_history = []
	}
}

function logData() {
	// Environment
	lunarSpark.environment.time_history.push(lunarSpark.environment.time)
	lunarSpark.environment.sun_angle_history.push(lunarSpark.environment.sun_angle)
	lunarSpark.environment.orbit.count_history.push(lunarSpark.environment.orbit.count)
    lunarSpark.environment.orbit.ascending_node_history.push(lunarSpark.environment.orbit.ascending_node)
	
	// Satellite
	for (var i=0;i<lunarSpark.satellites.length;i++) {
	    lunarSpark.satellites[i].orbit.anomaly_history.push(lunarSpark.satellites[i].orbit.anomaly)
	    lunarSpark.satellites[i].orbit.lat_history.push(lunarSpark.satellites[i].orbit.lat)
	    lunarSpark.satellites[i].orbit.long_history.push(lunarSpark.satellites[i].orbit.long)
	    lunarSpark.satellites[i].orbit.min_history.push(lunarSpark.satellites[i].orbit.min)
	    lunarSpark.satellites[i].battery.percent_history.push(lunarSpark.satellites[i].battery.percent)
	    lunarSpark.satellites[i].battery.charge_history.push(lunarSpark.satellites[i].battery.charge)
	    lunarSpark.satellites[i].solar_panel.power_output_history.push(lunarSpark.satellites[i].solar_panel.power_output)   
	   	lunarSpark.satellites[i].laser_power_draw_duty_cycle_history.push(lunarSpark.satellites[i].laser_power_draw * lunarSpark.system.satellite.laser_duty_cycle)
	   	lunarSpark.satellites[i].cumulative_laser_energy_draw_history.push(lunarSpark.satellites[i].cumulative_laser_energy_draw)
	   	lunarSpark.satellites[i].cumulative_laser_energy_output_history.push(lunarSpark.satellites[i].cumulative_laser_energy_output)   
	   	lunarSpark.satellites[i].cumulative_undelivered_laser_capacity_history.push(lunarSpark.satellites[i].cumulative_undelivered_laser_capacity)     	
   	}
	
	// Vehicle
	for (var i=0;i<lunarSpark.vehicles.length;i++) {
		lunarSpark.vehicles[i].battery.percent_history.push(lunarSpark.vehicles[i].battery.percent)
		lunarSpark.vehicles[i].battery.charge_history.push(lunarSpark.vehicles[i].battery.charge)
		lunarSpark.vehicles[i].solar_panel.power_output_history.push(lunarSpark.vehicles[i].solar_panel.power_output)
		lunarSpark.vehicles[i].laser_panel.power_output_history.push(lunarSpark.vehicles[i].laser_panel.power_output)
		lunarSpark.vehicles[i].laser_panel.excess_laser_panel_energy_history.push(lunarSpark.vehicles[i].laser_panel.excess_laser_panel_energy)
		lunarSpark.vehicles[i].laser_panel.cumulative_laser_panel_energy_history.push(lunarSpark.vehicles[i].laser_panel.cumulative_laser_panel_energy)
	}
}