var lunarSparkInput = {
    "test_case": {
      "filename": "ExtendedMissionConfig.json",
      "power_delivery_strategy": "Battery Percent",
      "vehicle_configuration": "Nominal Missions",
      "ttl_threshold": 360
    },
    "environment": {
      "time": 0,
      "time_step": 3,
      "predict_time": 0,
      // "small_battery": 501, // consider making this the default in the model when not specified
      "orbit": {
        "altitude": 700000,
        "ascending_node": 90,
        "count": 0
      },
      "sun_angle": 0,
      "cumulative_laser_energy_draw": 0,
      "cumulative_laser_energy_output": 0,
      "cumulative_undelivered_laser_capacity": 0,
      "excess_laser_panel_energy": 0,
      "cumulative_laser_panel_energy": 0,
      "delivered_efficiency": 0,
      "usable_energy": 0,
      "excesss_percent": 0,
      "overall_efficiency": 0,
      "ttl_below_threshold": 0,
      "ttl_below_zero": 0
    },
    "system": {
      "satellite": {
        "solar_panel_eff": 0.28,
        "eps_eff": 0.9,
        "laser_eff": 0.3,
        "laser_output_power": 12800,
        "laser_duty_cycle": 1,
        "laser_output_diameter": 0.3,
        "laser_wavelength": 4.45e-7
      },
      "vehicle": {
        "solar_panel_eff": 0.28,
        "laser_panel_eff": 0.6,
        "laser_panel_min_elevation": 45,
        "eps_eff": 0.9
      }
    },
    "satellites": [
      {
        "active": true,
        "id": "Spark1",
        "orbit": {
          "anamoly": 0
        },
        "solar_panel": {
          "area": 37.58
        },
        "battery": {
          "capacity": 16150,
          "charge": 16150,
          "dod": 0.6
        },
        "sat_power_draw": 2814,
        "laser_power_draw": 0,
        "vehicles": [],
        "vehData": -1,
        "chosen_vehicle": -1,
        "lasers": [],
        "cumulative_laser_energy_draw": 0,
        "cumulative_laser_energy_output": 0,
        "cumulative_undelivered_laser_capacity": 0,
        "beam_metrics": {
          "start_time": -1,
          "beam_count": 0,
          "last_beam": 0,
          "min_beam": 0,
          "max_beam": 0,
          "avg_beam": 0,
          "avg_power": 0
        }
      },
      {
        "active": true,
        "id": "Spark2",
        "orbit": {
          "anamoly": 180
        },
        "solar_panel": {
          "area": 37.58
        },
        "battery": {
          "capacity": 16150,
          "charge": 16150,
          "dod": 0.6
        },
        "sat_power_draw": 2814,
        "laser_power_draw": 0,
        "vehicles": [],
        "vehData": -1,
        "chosen_vehicle": -1,
        "lasers": [],
        "cumulative_laser_energy_draw": 0,
        "cumulative_laser_energy_output": 0,
        "cumulative_undelivered_laser_capacity": 0,
        "beam_metrics": {
          "start_time": -1,
          "beam_count": 0,
          "last_beam": 0,
          "min_beam": 0,
          "max_beam": 0,
          "avg_beam": 0,
          "avg_power": 0
        }
      }
    ],
    "vehicles": [
      {
        "active": true,
        "id": "IM Nova-C 1",
        "location": {
          "name": "Malpert A",
          "lat": -85,
          "long": 13,
          "shadow_model": [],
          "in_night": false,
          "in_shadow": false
        },
        "solar_panel": {
          "height": 1.5,
          "width": 1
        },
        "battery": {
          "capacity": 1625,
          "charge": 1625
        },
        "power_draw": 50,
        "ttl": 0,
        "ttl_below_threshold": 0,
        "ttl_below_zero": 0,
        "laser_panel": {
          "diameter": 0.75
        },
        "beams": [],
        "beam_metrics": {
          "beam_count": 0,
          "last_beam_energy": 0,
          "min_beam_energy": 0,
          "max_beam_energy": 0,
          "avg_beam_energy": 0
        },
        "excess_laser_panel_energy": 0,
        "cumulative_laser_panel_energy": 0
      },
      {
        "active": true,
        "id": "IM Nova-C 2",
        "location": {
          "name": "South Pole",
          "lat": -89.5,
          "long": 190,
          "shadow_model": [],
          "in_night": false,
          "in_shadow": false
        },
        "solar_panel": {
          "height": 1.5,
          "width": 1
        },
        "battery": {
          "capacity": 1625,
          "charge": 1625
        },
        "power_draw": 50,
        "ttl": 0,
        "ttl_below_threshold": 0,
        "ttl_below_zero": 0,
        "laser_panel": {
          "diameter": 0.75
        },
        "beams": [],
        "beam_metrics": {
          "beam_count": 0,
          "last_beam_energy": 0,
          "min_beam_energy": 0,
          "max_beam_energy": 0,
          "avg_beam_energy": 0
        },
        "excess_laser_panel_energy": 0,
        "cumulative_laser_panel_energy": 0
      },
      {
        "active": true,
        "id": "VIPER",
        "location": {
          "name": "Nobile Crater",
          "lat": -85,
          "long": 31,
          "shadow_model": [],
          "in_night": false,
          "in_shadow": false
        },
        "solar_panel": {
          "height": 1,
          "width": 1
        },
        "battery": {
          "capacity": 5625,
          "charge": 5625
        },
        "power_draw": 80,
        "ttl": 0,
        "ttl_below_threshold": 0,
        "ttl_below_zero": 0,
        "laser_panel": {
          "diameter": 0.75
        },
        "beams": [],
        "beam_metrics": {
          "beam_count": 0,
          "last_beam_energy": 0,
          "min_beam_energy": 0,
          "max_beam_energy": 0,
          "avg_beam_energy": 0
        },
        "excess_laser_panel_energy": 0,
        "cumulative_laser_panel_energy": 0
      },
      {
        "active": true,
        "id": "Draper S2",
        "location": {
          "name": "Schrödinger",
          "lat": -81,
          "long": 132,
          "shadow_model": [],
          "in_night": false,
          "in_shadow": false
        },
        "solar_panel": {
          "height": 1.5,
          "width": 1
        },
        "battery": {
          "capacity": 1188,
          "charge": 1188
        },
        "power_draw": 12.5,
        "ttl": 0,
        "ttl_below_threshold": 0,
        "ttl_below_zero": 0,
        "laser_panel": {
          "diameter": 0.75
        },
        "beams": [],
        "beam_metrics": {
          "beam_count": 0,
          "last_beam_energy": 0,
          "min_beam_energy": 0,
          "max_beam_energy": 0,
          "avg_beam_energy": 0
        },
        "excess_laser_panel_energy": 0,
        "cumulative_laser_panel_energy": 0
      },
      {
        "active": true,
        "id": "Chang'E-7",
        "location": {
          "name": "Shackelton",
          "lat": -89,
          "long": 123,
          "shadow_model": [],
          "in_night": false,
          "in_shadow": false
        },
        "solar_panel": {
          "height": 1.5,
          "width": 1
        },
        "battery": {
          "capacity": 250,
          "charge": 250
        },
        "power_draw": 12.5,
        "ttl": 0,
        "ttl_below_threshold": 0,
        "ttl_below_zero": 0,
        "laser_panel": {
          "diameter": 0.75
        },
        "beams": [],
        "beam_metrics": {
          "beam_count": 0,
          "last_beam_energy": 0,
          "min_beam_energy": 0,
          "max_beam_energy": 0,
          "avg_beam_energy": 0
        },
        "excess_laser_panel_energy": 0,
        "cumulative_laser_panel_energy": 0
      },
      {
        "active": true,
        "id": "Outland MAPP",
        "location": {
          "name": "",
          "lat": -85,
          "long": 295,
          "shadow_model": [],
          "in_night": false,
          "in_shadow": false
        },
        "solar_panel": {
          "height": 1.5,
          "width": 1
        },
        "battery": {
          "capacity": 500,
          "charge": 500
        },
        "power_draw": 25,
        "ttl": 0,
        "ttl_below_threshold": 0,
        "ttl_below_zero": 0,
        "laser_panel": {
          "diameter": 0.75
        },
        "beams": [],
        "beam_metrics": {
          "beam_count": 0,
          "last_beam_energy": 0,
          "min_beam_energy": 0,
          "max_beam_energy": 0,
          "avg_beam_energy": 0
        },
        "excess_laser_panel_energy": 0,
        "cumulative_laser_panel_energy": 0
      },
      {
        "active": true,
        "id": "Astrobotic Perrigrine",
        "location": {
          "name": "",
          "lat": -85,
          "long": 240,
          "shadow_model": [],
          "in_night": false,
          "in_shadow": false
        },
        "solar_panel": {
          "height": 1.5,
          "width": 1
        },
        "battery": {
          "capacity": 1250,
          "charge": 1250
        },
        "power_draw": 25,
        "ttl": 0,
        "ttl_below_threshold": 0,
        "ttl_below_zero": 0,
        "laser_panel": {
          "diameter": 0.75
        },
        "beams": [],
        "beam_metrics": {
          "beam_count": 0,
          "last_beam_energy": 0,
          "min_beam_energy": 0,
          "max_beam_energy": 0,
          "avg_beam_energy": 0
        },
        "excess_laser_panel_energy": 0,
        "cumulative_laser_panel_energy": 0
      },
      {
        "active": false,
        "id": "Astrobotic Griffin",
        "location": {
          "name": "",
          "lat": -90,
          "long": 0,
          "shadow_model": [],
          "in_night": false,
          "in_shadow": false
        },
        "solar_panel": {
          "height": 1.5,
          "width": 1
        },
        "battery": {
          "capacity": 6250,
          "charge": 6250
        },
        "power_draw": 150,
        "ttl": 0,
        "ttl_below_threshold": 0,
        "ttl_below_zero": 0,
        "laser_panel": {
          "diameter": 0.75
        },
        "beams": [],
        "beam_metrics": {
          "beam_count": 0,
          "last_beam_energy": 0,
          "min_beam_energy": 0,
          "max_beam_energy": 0,
          "avg_beam_energy": 0
        },
        "excess_laser_panel_energy": 0,
        "cumulative_laser_panel_energy": 0
      }
    ]
  }

