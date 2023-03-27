var lunarSparkInput = {
  "environment": {
    "time": 0,
    "orbit": {
      "period": 250,
      "altitude": 1300000,
      "ascending_node": 90,
      "count":0
    },
    "sun_angle": 0
  },
  "system": {
    "satellite": {
      "solar_panel_eff": 0.4,
      "eps_eff": 0.85,
      "laser_eff": 0.15,
      "laser_output_power": 16000,
      "laser_duty_cycle": 0.50,
      "laser_output_diameter": 1.22, 
      "laser_divergence_half_angle" : 0.0005/1000/2,
    },
    "vehicle": {
      "solar_panel_eff": 0.4,
      "laser_panel_eff": 0.5,
      "laser_panel_min_elevation" : 45,
      "eps_eff": 0.85,
    }
  },
  "vehicles": [
    {
      "active": true,
      "id": "VIPER0",
      "location": {
        "lat": -80,
        "long": 90,
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
        "diameter": 0.6,
      },
      "beams": []
    },
    {
      "active": true,
      "id": "SMALL1",
      "location": {
        "lat": -80,
        "long": 330,
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
    {
      "active": true,
      "id": "SMALL2",
      "location": {
        "lat": -85,
        "long": 330,
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
    {
      "active": true,
      "id": "SMALL3",
      "location": {
        "lat": -80,
        "long": 120,
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
    {
      "active": true,
      "id": "SMALL4",
      "location": {
        "lat": -85,
        "long": 120,
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
    {
      "active": true,
      "id": "SMALL5",
      "location": {
        "lat": -80,
        "long": 30,
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
    {
      "active": true,
      "id": "SMALL6",
      "location": {
        "lat": -85,
        "long": 30,
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
    {
      "active": true,
      "id": "SMALL7",
      "location": {
        "lat": -80,
        "long": 60,
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
    {
      "active": true,
      "id": "SMALL8",
      "location": {
        "lat": -85,
        "long": 60,
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
    {
      "active": false,
      "id": "SMALL9",
      "location": {
        "lat": -85,
        "long": 150,
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
    
    {
      "active": true,
      "id": "VIPER0",
      "location": {
        "lat": -80,
        "long": -90,
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
        "diameter": 0.6,
      },
      "beams": []
    },
    {
      "active": true,
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
    {
      "active": true,
      "id": "SMALL2",
      "location": {
        "lat": -85,
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
    {
      "active": true,
      "id": "SMALL3",
      "location": {
        "lat": -80,
        "long": 210,
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
    {
      "active": true,
      "id": "SMALL4",
      "location": {
        "lat": -85,
        "long": 210,
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
    {
      "active": true,
      "id": "SMALL5",
      "location": {
        "lat": -80,
        "long": 120,
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
    {
      "active": true,
      "id": "SMALL6",
      "location": {
        "lat": -85,
        "long": 120,
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
    {
      "active": true,
      "id": "SMALL7",
      "location": {
        "lat": -80,
        "long": 150,
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
    {
      "active": true,
      "id": "SMALL8",
      "location": {
        "lat": -85,
        "long": 150,
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
    {
      "active": false,
      "id": "SMALL9",
      "location": {
        "lat": -85,
        "long": 150,
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

  ],
  "satellites": [
    {
      "active": true,
      "id": "Spark1",
      "orbit": {
        "min": 37,
      },
      "solar_panel": {
        "area": 28,
      },
      "battery": {
        "capacity": 36000,
        "charge": 36000,
      },
      "sat_power_draw": 2000,
      "laser_count": 1,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    },
    {
      "active": false,
      "id": "Spark2",
      "orbit": {
        "min": 74,
      },
      "solar_panel": {
        "area": 12.5,
      },
      "battery": {
        "capacity": 5000,
        "charge": 5000,
      },
      "sat_power_draw": 1800,
      "laser_count": 1,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    },
    {
      "active": false,
      "id": "Spark3",
      "orbit": {
        "lat": 0,
        "long": 0,
        "min": 111,
        "anomaly": 180
      },
      "solar_panel": {
        "area": 30,
        "power_output": 0
      },
      "battery": {
        "capacity": 10000,
        "charge": 10000,
        "percent": 0
      },
      "sat_power_draw": 2000,
      "laser_count": 1,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    },
    {
      "active": false,
      "id": "Spark4",
      "orbit": {
        "lat": 0,
        "long": 0,
        "min": 0,
        "anomaly": 180
      },
      "solar_panel": {
        "area": 12.5,
        "power_output": 0
      },      
      "battery": {
        "capacity": 5000,
        "charge": 5000,
        "percent": 0
      },
      "sat_power_draw": 2000,
      "laser_count": 1,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    }
  ]
}