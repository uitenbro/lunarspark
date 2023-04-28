var lunarSparkInput = {
  "environment": {
    "time": 0,
    "orbit": { // TODO: move this to satellite and create perpendicular orbit
      "period": 180.02,
      "altitude": 700000,
      "ascending_node": 90,
      "count":0
    },
    "sun_angle": 0 // TODO: add solar flux and sun angle period to inputs
  },
  "system": {
    "satellite": {
      "solar_panel_eff": 0.25, // 35% ideal x 77% inherant x 93% degradation-8 years
      "eps_eff": 0.90,
      "laser_eff": 0.30,
      "laser_output_power": 12850,
      "laser_duty_cycle": 1.00,
      "laser_output_diameter": 0.30, 
      "laser_wavelength" : 445/1000000000,
    },
    "vehicle": {
      "solar_panel_eff": 0.25,
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
        "area": 85,
      },
      "battery": {
        "capacity": 32500,
        "charge": 32500,
      },
      "sat_power_draw": 10700,  // SMAD Prelimnary Sizing S/C
      "laser_count": 1,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    },  
    {
      "active": true,
      "id": "Spark2",
      "orbit": {
        "min": 90,
      },
      "solar_panel": {
        "area": 85,
      },
      "battery": {
        "capacity": 32500,
        "charge": 32500,
      },
      "sat_power_draw": 10700, // SMAD Prelimnary Sizing S/C
      "laser_count": 1,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    },
  ],
  "vehicles": [
    {
      "active": true,
      "id": "VIPER0",
      "location": {
        "lat": -80,
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
      "beams": []
    },
    {
      "active": true,
      "id": "VIPER0",
      "location": {
        "lat": -90,
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
      "beams": []
    },
    {
      "active": false,
      "id": "LARGE",
      "location": {
        "lat": -90,
        "long": 180,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 1,
      },
      "battery": {
        "capacity": 5000,
        "charge": 2500,
      },
      "power_draw": 160,
      "laser_panel": {
        "diameter": 0.6,
      },
      "beams": []
    },  
  //   {
  //     "active": true,
  //     "id": "SMALL2",
  //     "location": {
  //       "lat": -85,
  //       "long": 330,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },     
  //   {
  //     "active": true,
  //     "id": "SMALL3",
  //     "location": {
  //       "lat": -80,
  //       "long": 120,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },  
  //   {
  //     "active": true,
  //     "id": "SMALL4",
  //     "location": {
  //       "lat": -85,
  //       "long": 120,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },  
  //   {
  //     "active": true,
  //     "id": "SMALL5",
  //     "location": {
  //       "lat": -80,
  //       "long": 30,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },  
  //   {
  //     "active": true,
  //     "id": "SMALL6",
  //     "location": {
  //       "lat": -85,
  //       "long": 30,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },     
  //   {
  //     "active": true,
  //     "id": "SMALL7",
  //     "location": {
  //       "lat": -80,
  //       "long": 60,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },  
  //   {
  //     "active": true,
  //     "id": "SMALL8",
  //     "location": {
  //       "lat": -85,
  //       "long": 60,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   }, 
  //   {
  //     "active": false,
  //     "id": "SMALL9",
  //     "location": {
  //       "lat": -85,
  //       "long": 150,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   }, 
    

    {
      "active": false,
      "id": "SMALL1",
      "location": {
        "lat": -80,
        "long": 240,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 1,
      },
      "battery": {
        "capacity": 5000,
        "charge": 2500,
      },
      "power_draw": 10,
      "laser_panel": {
        "diameter": 0.6,
      },
      "beams": []
    },  
  //   {
  //     "active": true,
  //     "id": "SMALL2",
  //     "location": {
  //       "lat": -85,
  //       "long": 240,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },     
  //   {
  //     "active": true,
  //     "id": "SMALL3",
  //     "location": {
  //       "lat": -80,
  //       "long": 210,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },  
  //   {
  //     "active": true,
  //     "id": "SMALL4",
  //     "location": {
  //       "lat": -85,
  //       "long": 210,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },  
  //   {
  //     "active": true,
  //     "id": "SMALL5",
  //     "location": {
  //       "lat": -80,
  //       "long": 120,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },  
  //   {
  //     "active": true,
  //     "id": "SMALL6",
  //     "location": {
  //       "lat": -85,
  //       "long": 120,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },     
  //   {
  //     "active": true,
  //     "id": "SMALL7",
  //     "location": {
  //       "lat": -80,
  //       "long": 150,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   },  
  //   {
  //     "active": true,
  //     "id": "SMALL8",
  //     "location": {
  //       "lat": -85,
  //       "long": 150,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   }, 
  //   {
  //     "active": false,
  //     "id": "SMALL9",
  //     "location": {
  //       "lat": -85,
  //       "long": 150,
  //       "shadow_model": [],
  //       "in_night": false,
  //       "in_shadow": false
  //     },
  //     "solar_panel": {
  //       "height": 1,
  //       "width": 1,
  //     },
  //     "battery": {
  //       "capacity": 5000,
  //       "charge": 2500,
  //     },
  //     "power_draw": 10,
  //     "laser_panel": {
  //       "diameter": 0.6,
  //     },
  //     "beams": []
  //   }, 

  ],
}