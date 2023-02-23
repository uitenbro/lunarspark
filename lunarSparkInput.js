var lunarSparkInput = {
  "environment": {
    "time": 0,
    "orbit": {
      "period": 148,
      "altitude": 402000,
      "ascending_node": 90,
      "count":0
    },
    "sun_angle": 0
  },
  "system": {
    "satellite": {
      "solar_panel_eff": 0.3,
      "eps_eff": 0.5,
      "laser_eff": 0.2,
      "watt_output_per_laser": 1,
    },
    "vehicle": {
      "solar_panel_eff": 0.3,
      "eps_eff": 0.5,
      "laser_panel_eff": 0.4
    }
  },
  "vehicles": [
    {
      "active": true,
      "id": "VIPER0",
      "location": {
        "lat": -80,
        "long": 0,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 2,
        "power_output": 0
      },
      "battery": {
        "capacity": 5.0,
        "charge": 1,
        "percent": 0
      },
      "power_draw": 0.080,
      "laser_panel": {
        "height": 1,
        "width": 1,
        "power_output": 0
      },
      "beams": []
    },
    {
      "active": true,
      "id": "SMALL1",
      "location": {
        "lat": -80,
        "long": 90,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 1,
        "power_output": 0
      },
      "battery": {
        "capacity": 3.0,
        "charge": 1,
        "percent": 0
      },
      "power_draw": 0.010,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
        "power_output": 0
      },
      "beams": []
    },
    {
      "active": true,
      "id": "VIPER2",
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
        "power_output": 0
      },
      "eps_efficiency": 0.5,
      "battery": {
        "capacity": 5.0,
        "charge": 5.0,
        "percent": 0
      },
      "power_draw": 0.300,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,        
        "power_output": 0
      },
      "beams": []
    },
    {
      "active": true,
      "id": "SMALL3",
      "location": {
        "lat": -80,
        "long": 270,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 1,
        "power_output": 0
      },
      "battery": {
        "capacity": 5.0,
        "charge": 1,
        "percent": 0
      },
      "power_draw": 0.080,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
        "power_output": 0
      },
      "beams": [
      ]
    }, 
    {
      "active": true,
      "id": "SMALL4",
      "location": {
        "lat": -85,
        "long": 0,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 1,
        "power_output": 0
      },
      "battery": {
        "capacity": 5.0,
        "charge": 1,
        "percent": 0
      },
      "power_draw": 0.10,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
        "power_output": 0
      },
      "beams": []
    },
    {
      "active": true,
      "id": "SMALL5",
      "location": {
        "lat": -85,
        "long": 90,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 1,
        "power_output": 0
      },
      "battery": {
        "capacity": 5.0,
        "charge": 1,
        "percent": 0
      },
      "power_draw": 0.010,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
        "power_output": 0
      },
      "beams": []
    },
    {
      "active": true,
      "id": "SMALL6",
      "location": {
        "lat": -85,
        "long": 180,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 1,
        "power_output": 0
      },
      "battery": {
        "capacity": 5.0,
        "charge": 1,
        "percent": 0
      },
      "power_draw": 0.010,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
        "power_output": 0
      },
      "beams": []
    },
    {
      "active": true,
      "id": "SMALL7",
      "location": {
        "lat": -85,
        "long": 270,
        "shadow_model": [],
        "in_night": false,
        "in_shadow": false
      },
      "solar_panel": {
        "height": 1,
        "width": 1,
        "power_output": 0
      },
      "battery": {
        "capacity": 5.0,
        "charge": 1,
        "percent": 0
      },
      "power_draw": 0.010,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
        "power_output": 0
      },
      "beams": []
    }
  ],
  "satellites": [
    {
      "active": true,
      "id": "Spark1",
      "orbit": {
        "lat": 0,
        "long": 0,
        "min": 37,
        "anomaly": 0
      },
      "solar_panel": {
        "area": 25,
        "power_output": 0
      },
      "battery": {
        "capacity": 5.0,
        "charge": 5.0,
        "percent": 0
      },
      "sat_power_draw": 1.8,
      "laser_count": 4,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    },
    {
      "active": false,
      "id": "Spark2",
      "orbit": {
        "lat": 0,
        "long": 0,
        "min": 74,
        "anomaly": 0
      },
      "solar_panel": {
        "area": 12.5,
        "power_output": 0
      },
      "battery": {
        "capacity": 5.0,
        "charge": 5.0,
        "percent": 0
      },
      "sat_power_draw": 1.8,
      "laser_count": 4,
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
        "anomaly": 0
      },
      "solar_panel": {
        "area": 25,
        "power_output": 0
      },
      "battery": {
        "capacity": 5.0,
        "charge": 5.0,
        "percent": 0
      },
      "sat_power_draw": 1.8,
      "laser_count": 4,
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
        "anomaly": 0
      },
      "solar_panel": {
        "area": 12.5,
        "power_output": 0
      },      
      "battery": {
        "capacity": 5.0,
        "charge": 5.0,
        "percent": 0
      },
      "sat_power_draw": 1.8,
      "laser_count": 4,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    }
  ]
}