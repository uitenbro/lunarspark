var lunarSparkInput = {
  "test_case" :{
    "power_delivery_strategy" : "Battery Percent",
    "vehicle_configuration" : "Lg:1/85 Sp:NA",
  },
  "environment": {
    "time": 0,
    "orbit": { // TODO: move this to satellite and calculate based on altitude
      "period": 179.86,
      "altitude": 700000,
      "ascending_node": 90,
      "count":0
    },
    "sun_angle": 0, // TODO: add solar flux and sun angle period to inputs
    "cumulative_laser_energy_draw" : 0,
    "cumulative_laser_energy_output" : 0,
    "cumulative_undelivered_laser_capacity" : 0,
    "excess_laser_panel_energy" : 0,
    "cumulative_laser_panel_energy" : 0,
    "delivered_efficiency": 0, 
    "usable_energy": 0,
    "excesss_percent": 0,
    "overall_efficiency": 0, 
  },
  "system": {
    "satellite": {
      "solar_panel_eff": 0.28, // cos(10deg off pointing) x 39% ideal x 77% inherant x 93% degradation-8 years
      "eps_eff": 0.90,
      "laser_eff": 0.30,
      "laser_output_power": 12800,
      "laser_duty_cycle": 1.00,
      "laser_output_diameter": 0.30, 
      "laser_wavelength" : 445/1000000000,
    },
    "vehicle": {
      "solar_panel_eff": 0.28,  // same as satellite
      "laser_panel_eff": 0.60,
      "laser_panel_min_elevation" : 45,
      "eps_eff": 0.90,
    }
  },
  "satellites": [
    {
      "active": true,
      "id": "Spark1",
      "orbit": {
        "min": 0,
      },
      "solar_panel": {
        "area": 37.58,
      },
      "battery": {
        "capacity": 16150,
        "charge": 16150,
        "dod": 0.60 // TODO: Set yellow color bar based on dod
      },
      "sat_power_draw": 2814,  // SMAD S/C Pre Sizing S/C Avg Pwr
      "laser_power_draw": 0,
      "vehicles": [],
      "chosen_vehicle" : -1,
      "lasers": [],
      "cumulative_laser_energy_draw" : 0,
      "cumulative_laser_energy_output" : 0,
      "cumulative_undelivered_laser_capacity" : 0,
    },  
    {
      "active": true,
      "id": "Spark2",
      "orbit": {
        "min": 90,
      },
      "solar_panel": {
        "area": 37.58,
      },
      "battery": {
        "capacity": 16150, // SMAD Secondary Battery Sizing
        "charge": 16150,
        "dod": 0.60
      },
      "sat_power_draw": 2814, // SMAD S/C Pre Sizing S/C Avg Pwr
      "laser_power_draw": 0,
      "vehicles": [],
      "chosen_vehicle" : -1,
      "lasers": [],
      "cumulative_laser_energy_draw" : 0,
      "cumulative_laser_energy_output" : 0,
      "cumulative_undelivered_laser_capacity" : 0,
    },
  ],
  "vehicles": [
    {
      "active": true,
      "id": "VIPER0",
      "location": {
        "lat": -85,
        "long": 0,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 2,
      },
      "battery": {
        "capacity": 5000,
        "charge": 2500,
      },
      "power_draw": 80,
      "laser_panel": {
        "diameter": 0.75,
      },
      "beams": [],
      "excess_laser_panel_energy" : 0,
      "cumulative_laser_panel_energy" : 0,
    },
    {
      "active": true,
      "id": "VIPER1",
      "location": {
        "lat": -85,
        "long": 180,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 2,
      },
      "battery": {
        "capacity": 5000,
        "charge": 2500,
      },
      "power_draw": 80,
      "laser_panel": {
        "diameter": 0.75,
      },
      "beams": [],
      "excess_laser_panel_energy" : 0,
      "cumulative_laser_panel_energy" : 0,
    },
    // //   {
    // //   "active": true,
    // //   "id": "SMALL1",
    // //   "location": {
    // //     "lat": -80,
    // //     "long": 0,
    // //     "shadow_model": [],
    // //     "in_night": false,
    // //     "in_shadow": false
    // //   },
    // //   "solar_panel": {
    // //     "height": 1,
    // //     "width": 2,
    // //   },
    // //   "battery": {
    // //     "capacity": 5000,
    // //     "charge": 2500,
    // //   },
    // //   "power_draw": 10,
    // //   "laser_panel": {
    // //     "diameter": 0.75,
    // //   },
    // //   "beams": [],
    // //   "excess_laser_panel_energy" : 0,
    // //   "cumulative_laser_panel_energy" : 0,
    // // },
    // // {
    // //   "active": true,
    // //   "id": "SMALL2",
    // //   "location": {
    // //     "lat": -80,
    // //     "long": 30,
    // //     "shadow_model": [],
    // //     "in_night": false,
    // //     "in_shadow": false
    // //   },
    // //   "solar_panel": {
    // //     "height": 1,
    // //     "width": 2,
    // //   },
    // //   "battery": {
    // //     "capacity": 5000,
    // //     "charge": 2500,
    // //   },
    // //   "power_draw": 10,
    // //   "laser_panel": {
    // //     "diameter": 0.75,
    // //   },
    // //   "beams": [],
    // //   "excess_laser_panel_energy" : 0,
    // //   "cumulative_laser_panel_energy" : 0,
    // // },
    // // {
    // //   "active": true,
    // //   "id": "SMALL3",
    // //   "location": {
    // //     "lat": -80,
    // //     "long": 60,
    // //     "shadow_model": [],
    // //     "in_night": false,
    // //     "in_shadow": false
    // //   },
    // //   "solar_panel": {
    // //     "height": 1,
    // //     "width": 2,
    // //   },
    // //   "battery": {
    // //     "capacity": 5000,
    // //     "charge": 2500,
    // //   },
    // //   "power_draw": 10,
    // //   "laser_panel": {
    // //     "diameter": 0.75,
    // //   },
    // //   "beams": [],
    // //   "excess_laser_panel_energy" : 0,
    // //   "cumulative_laser_panel_energy" : 0,
    // // },
    // // {
    // //   "active": true,
    // //   "id": "SMALL4",
    // //   "location": {
    // //     "lat": -80,
    // //     "long": 90,
    // //     "shadow_model": [],
    // //     "in_night": false,
    // //     "in_shadow": false
    // //   },
    // //   "solar_panel": {
    // //     "height": 1,
    // //     "width": 2,
    // //   },
    // //   "battery": {
    // //     "capacity": 5000,
    // //     "charge": 2500,
    // //   },
    // //   "power_draw": 10,
    // //   "laser_panel": {
    // //     "diameter": 0.75,
    // //   },
    // //   "beams": [],
    // //   "excess_laser_panel_energy" : 0,
    // //   "cumulative_laser_panel_energy" : 0,
    // // },
    //    {
    //   "active": true,
    //   "id": "SMALL5",
    //   "location": {
    //     "lat": -80,
    //     "long": 120,
    //     "shadow_model": [],
    //     "in_night": false,
    //     "in_shadow": false
    //   },
    //   "solar_panel": {
    //     "height": 1,
    //     "width": 2,
    //   },
    //   "battery": {
    //     "capacity": 5000,
    //     "charge": 2500,
    //   },
    //   "power_draw": 10,
    //   "laser_panel": {
    //     "diameter": 0.75,
    //   },
    //   "beams": [],
    //   "excess_laser_panel_energy" : 0,
    //   "cumulative_laser_panel_energy" : 0,
    // },
    // {
    //   "active": true,
    //   "id": "SMALL6",
    //   "location": {
    //     "lat": -80,
    //     "long": 150,
    //     "shadow_model": [],
    //     "in_night": false,
    //     "in_shadow": false
    //   },
    //   "solar_panel": {
    //     "height": 1,
    //     "width": 2,
    //   },
    //   "battery": {
    //     "capacity": 5000,
    //     "charge": 2500,
    //   },
    //   "power_draw": 10,
    //   "laser_panel": {
    //     "diameter": 0.75,
    //   },
    //   "beams": [],
    //   "excess_laser_panel_energy" : 0,
    //   "cumulative_laser_panel_energy" : 0,
    // },
    // {
    //   "active": true,
    //   "id": "SMALL7",
    //   "location": {
    //     "lat": -80,
    //     "long": 180,
    //     "shadow_model": [],
    //     "in_night": false,
    //     "in_shadow": false
    //   },
    //   "solar_panel": {
    //     "height": 1,
    //     "width": 2,
    //   },
    //   "battery": {
    //     "capacity": 5000,
    //     "charge": 2500,
    //   },
    //   "power_draw": 10,
    //   "laser_panel": {
    //     "diameter": 0.75,
    //   },
    //   "beams": [],
    //   "excess_laser_panel_energy" : 0,
    //   "cumulative_laser_panel_energy" : 0,
    // },
    // {
    //   "active": true,
    //   "id": "SMALL8",
    //   "location": {
    //     "lat": -80,
    //     "long": 210,
    //     "shadow_model": [],
    //     "in_night": false,
    //     "in_shadow": false
    //   },
    //   "solar_panel": {
    //     "height": 1,
    //     "width": 2,
    //   },
    //   "battery": {
    //     "capacity": 5000,
    //     "charge": 2500,
    //   },
    //   "power_draw": 10,
    //   "laser_panel": {
    //     "diameter": 0.75,
    //   },
    //   "beams": [],
    //   "excess_laser_panel_energy" : 0,
    //   "cumulative_laser_panel_energy" : 0,
    // },
    // {
    //   "active": true,
    //   "id": "SMALL9",
    //   "location": {
    //     "lat": -80,
    //     "long": 240,
    //     "shadow_model": [],
    //     "in_night": false,
    //     "in_shadow": false
    //   },
    //   "solar_panel": {
    //     "height": 1,
    //     "width": 2,
    //   },
    //   "battery": {
    //     "capacity": 5000,
    //     "charge": 2500,
    //   },
    //   "power_draw": 10,
    //   "laser_panel": {
    //     "diameter": 0.75,
    //   },
    //   "beams": [],
    //   "excess_laser_panel_energy" : 0,
    //   "cumulative_laser_panel_energy" : 0,
    // },
    // {
    //   "active": true,
    //   "id": "SMALL10",
    //   "location": {
    //     "lat": -85,
    //     "long": 120,
    //     "shadow_model": [],
    //     "in_night": false,
    //     "in_shadow": false
    //   },
    //   "solar_panel": {
    //     "height": 1,
    //     "width": 2,
    //   },
    //   "battery": {
    //     "capacity": 5000,
    //     "charge": 2500,
    //   },
    //   "power_draw": 10,
    //   "laser_panel": {
    //     "diameter": 0.75,
    //   },
    //   "beams": [],
    //   "excess_laser_panel_energy" : 0,
    //   "cumulative_laser_panel_energy" : 0,
    // },
    // {
    //   "active": true,
    //   "id": "SMALL11",
    //   "location": {
    //     "lat": -85,
    //     "long": 150,
    //     "shadow_model": [],
    //     "in_night": false,
    //     "in_shadow": false
    //   },
    //   "solar_panel": {
    //     "height": 1,
    //     "width": 2,
    //   },
    //   "battery": {
    //     "capacity": 5000,
    //     "charge": 2500,
    //   },
    //   "power_draw": 10,
    //   "laser_panel": {
    //     "diameter": 0.75,
    //   },
    //   "beams": [],
    //   "excess_laser_panel_energy" : 0,
    //   "cumulative_laser_panel_energy" : 0,
    // },
    // // {
    // //   "active": true,
    // //   "id": "SMALL12",
    // //   "location": {
    // //     "lat": -85,
    // //     "long": 180,
    // //     "shadow_model": [],
    // //     "in_night": false,
    // //     "in_shadow": false
    // //   },
    // //   "solar_panel": {
    // //     "height": 1,
    // //     "width": 2,
    // //   },
    // //   "battery": {
    // //     "capacity": 5000,
    // //     "charge": 2500,
    // //   },
    // //   "power_draw": 10,
    // //   "laser_panel": {
    // //     "diameter": 0.75,
    // //   },
    // //   "beams": [],
    // //   "excess_laser_panel_energy" : 0,
    // //   "cumulative_laser_panel_energy" : 0,
    // // },
    // {
    //   "active": true,
    //   "id": "SMALL13",
    //   "location": {
    //     "lat": -85,
    //     "long": 210,
    //     "shadow_model": [],
    //     "in_night": false,
    //     "in_shadow": false
    //   },
    //   "solar_panel": {
    //     "height": 1,
    //     "width": 2,
    //   },
    //   "battery": {
    //     "capacity": 5000,
    //     "charge": 2500,
    //   },
    //   "power_draw": 10,
    //   "laser_panel": {
    //     "diameter": 0.75,
    //   },
    //   "beams": [],
    //   "excess_laser_panel_energy" : 0,
    //   "cumulative_laser_panel_energy" : 0,
    // },
    // {
    //   "active": true,
    //   "id": "SMALL14",
    //   "location": {
    //     "lat": -85,
    //     "long": 240,
    //     "shadow_model": [],
    //     "in_night": false,
    //     "in_shadow": false
    //   },
    //   "solar_panel": {
    //     "height": 1,
    //     "width": 2,
    //   },
    //   "battery": {
    //     "capacity": 5000,
    //     "charge": 2500,
    //   },
    //   "power_draw": 10,
    //   "laser_panel": {
    //     "diameter": 0.75,
    //   },
    //   "beams": [],
    //   "excess_laser_panel_energy" : 0,
    //   "cumulative_laser_panel_energy" : 0,
    // },

  ],
}

