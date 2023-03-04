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
      "watt_output_per_laser": 1000,
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
      },
      "battery": {
        "capacity": 5000,
        "charge": 1000,
      },
      "power_draw": 80,
      "laser_panel": {
        "height": 1,
        "width": 1,
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
      },
      "battery": {
        "capacity": 3000,
        "charge": 1000,
      },
      "power_draw": 10,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
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
      },
      "eps_efficiency": 0.5,
      "battery": {
        "capacity": 5000,
        "charge": 5000,
      },
      "power_draw": 300,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,        
      },
      "beams": []
    },
    {
      "active": true,
      "id": "SMALLOper3",
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
      },
      "battery": {
        "capacity": 5000,
        "charge": 4000,
      },
      "power_draw": 80,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
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
      },
      "battery": {
        "capacity": 5000,
        "charge": 1500,
      },
      "power_draw": 10,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
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
      },
      "battery": {
        "capacity": 5000,
        "charge": 1000,
      },
      "power_draw": 10,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
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
      },
      "battery": {
        "capacity": 5000,
        "charge": 1000,
      },
      "power_draw": 10,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
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
      },
      "battery": {
        "capacity": 5000,
        "charge": 1000,
      },
      "power_draw": 10,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
      },
      "beams": []
    },
    {
      "active": true,
      "id": "SMALL8",
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
        "charge": 1000,
      },
      "power_draw": 10,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
      },
      "beams": []
    },
    {
      "active": false,
      "id": "SMALL9",
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
        "charge": 1000,
      },
      "power_draw": 20,
      "laser_panel": {
        "height": 0.5,
        "width": 0.5,
      },
      "beams": []
    }
  ],
  "satellites": [
    {
      "active": false,
      "id": "Spark1",
      "orbit": {
        "min": 37,
      },
      "solar_panel": {
        "area": 25,
      },
      "battery": {
        "capacity": 5000,
        "charge": 5000,
      },
      "sat_power_draw": 1800,
      "laser_count": 4,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    },
    {
      "active": true,
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
      "laser_count": 4,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    },
    {
      "active": true,
      "id": "Spark3",
      "orbit": {
        "lat": 0,
        "long": 0,
        "min": 111,
        "anomaly": 180
      },
      "solar_panel": {
        "area": 25,
        "power_output": 0
      },
      "battery": {
        "capacity": 10000,
        "charge": 7500,
        "percent": 0
      },
      "sat_power_draw": 2000,
      "laser_count": 4,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    },
    {
      "active": true,
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
      "laser_count": 4,
      "laser_power_draw": 0,
      "vehicles": [],
      "lasers": []
    }
  ]
}