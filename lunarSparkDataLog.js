function initializeDataLog() {
	// Environment
	lunarSpark.environment.time_history = []
	lunarSpark.environment.sun_angle_history = []
	lunarSpark.environment.orbit.count_history = []
    lunarSpark.environment.orbit.ascending_node_history = []
    lunarSpark.environment.cumulative_laser_energy_draw_history = []
    lunarSpark.environment.cumulative_laser_energy_output_history = []
    lunarSpark.environment.cumulative_undelivered_laser_capacity_history = []
    lunarSpark.environment.excess_laser_panel_energy_history = []
    lunarSpark.environment.cumulative_laser_panel_energy_history = []
    lunarSpark.environment.delivered_efficiency_history = []
    lunarSpark.environment.usable_energy_history = []
    lunarSpark.environment.excesss_percent_history = []
    lunarSpark.environment.overall_efficiency_history = []
    lunarSpark.environment.ttl_below_threshold_history = []
    lunarSpark.environment.ttl_below_zero_history = []

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
		lunarSpark.vehicles[i].ttl_history = []
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
	// Set overall cumulative to zero and then acrue each satellites cumulatives
	lunarSpark.environment.cumulative_laser_energy_draw = 0
    lunarSpark.environment.cumulative_laser_energy_output = 0 
    lunarSpark.environment.cumulative_undelivered_laser_capacity = 0
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
   	
   		lunarSpark.environment.cumulative_laser_energy_draw += lunarSpark.satellites[i].cumulative_laser_energy_draw
    	lunarSpark.environment.cumulative_laser_energy_output += lunarSpark.satellites[i].cumulative_laser_energy_output
    	lunarSpark.environment.cumulative_undelivered_laser_capacity += lunarSpark.satellites[i].cumulative_undelivered_laser_capacity
   	}
	
	// Vehicle
	// Set overall cumulative to zero and then acrue each satellites cumulatives
	lunarSpark.environment.excess_laser_panel_energy = 0
   	lunarSpark.environment.cumulative_laser_panel_energy = 0
   	lunarSpark.environment.ttl_below_threshold = 0
    lunarSpark.environment.ttl_below_zero = 0
	for (var i=0;i<lunarSpark.vehicles.length;i++) {
		lunarSpark.vehicles[i].battery.percent_history.push(lunarSpark.vehicles[i].battery.percent)
		lunarSpark.vehicles[i].battery.charge_history.push(lunarSpark.vehicles[i].battery.charge)
		lunarSpark.vehicles[i].ttl_history.push(lunarSpark.vehicles[i].ttl)
		lunarSpark.vehicles[i].solar_panel.power_output_history.push(lunarSpark.vehicles[i].solar_panel.power_output)
		lunarSpark.vehicles[i].laser_panel.power_output_history.push(lunarSpark.vehicles[i].laser_panel.power_output)
		lunarSpark.vehicles[i].laser_panel.excess_laser_panel_energy_history.push(lunarSpark.vehicles[i].laser_panel.excess_laser_panel_energy)
		lunarSpark.vehicles[i].laser_panel.cumulative_laser_panel_energy_history.push(lunarSpark.vehicles[i].laser_panel.cumulative_laser_panel_energy)
	
	    lunarSpark.environment.excess_laser_panel_energy += lunarSpark.vehicles[i].excess_laser_panel_energy
    	lunarSpark.environment.cumulative_laser_panel_energy += lunarSpark.vehicles[i].cumulative_laser_panel_energy

    	lunarSpark.environment.ttl_below_threshold += lunarSpark.vehicles[i].ttl_below_threshold
    	lunarSpark.environment.ttl_below_zero += lunarSpark.vehicles[i].ttl_below_zero
	}

    lunarSpark.environment.cumulative_laser_energy_draw_history.push(lunarSpark.environment.cumulative_laser_energy_draw)
    lunarSpark.environment.cumulative_laser_energy_output_history.push(lunarSpark.environment.cumulative_laser_energy_output)
    lunarSpark.environment.cumulative_undelivered_laser_capacity_history.push(lunarSpark.environment.cumulative_undelivered_laser_capacity)
    lunarSpark.environment.excess_laser_panel_energy_history.push(lunarSpark.environment.excess_laser_panel_energy)
    lunarSpark.environment.cumulative_laser_panel_energy_history.push(lunarSpark.environment.cumulative_laser_panel_energy)

    lunarSpark.environment.usable_energy = lunarSpark.environment.cumulative_laser_panel_energy-lunarSpark.environment.excess_laser_panel_energy
    if (lunarSpark.environment.cumulative_laser_panel_energy != 0) {
    	lunarSpark.environment.excesss_percent = (lunarSpark.environment.excess_laser_panel_energy/lunarSpark.environment.cumulative_laser_panel_energy)*100
    }
    else {
    	lunarSpark.environment.excesss_percent = 0
    }
    if (lunarSpark.environment.cumulative_laser_energy_draw !=0) {
    	lunarSpark.environment.delivered_efficiency = (lunarSpark.environment.cumulative_laser_panel_energy/lunarSpark.environment.cumulative_laser_energy_draw)*100
    	lunarSpark.environment.overall_efficiency = (lunarSpark.environment.usable_energy/lunarSpark.environment.cumulative_laser_energy_draw)*100
	}
	else {
		lunarSpark.environment.overall_efficiency = 0
	}
    lunarSpark.environment.usable_energy_history.push(lunarSpark.environment.usable_energy)
    lunarSpark.environment.delivered_efficiency_history.push(lunarSpark.environment.delivered_efficiency)
    lunarSpark.environment.excesss_percent_history.push(lunarSpark.environment.excesss_percent)
    lunarSpark.environment.overall_efficiency_history.push(lunarSpark.environment.overall_efficiency)
    lunarSpark.environment.ttl_below_threshold_history.push(lunarSpark.environment.ttl_below_threshold)
    lunarSpark.environment.ttl_below_zero_history.push(lunarSpark.environment.ttl_below_zero)

}

function saveFile() {
  const defaultFilename = lunarSpark.test_case.filename;
  const filename = prompt("Enter a filename (with .json extension):", defaultFilename);
  if (filename === null) {
    // Prompt was cancelled
    return;
  }

  if (!filename.trim()) {
    alert("Invalid filename. Please try again.");
    return;
  }
  // filename is good so assign it to the datastores
  lunarSpark.test_case.filename = filename
  var lunarSparkInputSave = JSON.parse(localStorage.getItem("lunarSparkInput"))
  lunarSparkInputSave.test_case.filename = filename
  var object = {"lunarSparkInput": lunarSparkInputSave,
				"lunarSpark": lunarSpark}

  const json = JSON.stringify(object, null, 2);
  const blob = new Blob([json], { type: 'application/json' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}`;
  link.click();
  URL.revokeObjectURL(link.href);
  printAll()
}

function loadFile(event) {
  const file = event.target.files[0];
  if (!file) {
    return; // No file selected
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const contents = e.target.result;
    const parsedData = JSON.parse(contents);

    // setup initial input and current state to match the config file
    lunarSparkInput = parsedData.lunarSparkInput;
    localStorage.setItem("lunarSparkInput", JSON.stringify(lunarSparkInput));
    if (parsedData.lunarSpark) {
	    lunarSpark = parsedData.lunarSpark;
	}
	// no runtime data so intialize everythin
    else {
    	lunarSpark = lunarSparkInput
    	initializeDataLog();
  	    stepSim(0)

    }
    if (file.name != lunarSpark.test_case.filename) {
		const promptMessage = "Internal test case filename does not match actual filename.\n" +
  							  "Click OK to change the internal filename to:\n" + file.name + "\n" +
  							  "Click Cancel to leave it the way it is.";
    	const userChoice = window.confirm(promptMessage);
    	handlePromptResponse(userChoice, file.name);
    }
    // set time to configured time
    time = lunarSpark.environment.time
    prevTime = lunarSpark.environment.time
    // update the screen
    clearCanvas();
    drawAll();
    printAll()

  };
  reader.readAsText(file);
   
}
function handlePromptResponse(result, filename) {
  if (result) {
  	lunarSpark.test_case.filename = filename
    // User clicked "Yes"
    console.log("Yes");
    // Perform your desired actions for "Yes"
  } else {
    // User clicked "No" or closed the prompt
    console.log("No");
    // Perform your desired actions for "No" or prompt cancellation
  }
}