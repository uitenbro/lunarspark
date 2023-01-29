var lunarSparkInput = 

{
  "environment": {
    "time": 0,
    "orbit": {
      "period": 148,
      "altitude": 402000,
      "ascending_node": 180
    },
    "sun_angle": 0
  },
  "customers": [
    {
      "id": "VIPER1",
      "location": {
        "lat": 90,
        "long": 0
      },
      "solar_panel": {
        "height": 1,
        "width": 2
      },
      "eps_eff": 0.5,
      "battery": {
        "capacity": 5.0,
        "charge": 1
      },
      "power_draw": 80,
      "laser_panel": {
        "height": 1,
        "width": 2
      }
    },
    {
      "id": "SMALL2",
      "location": {
        "lat": 85,
        "long": 60
      },
      "solar_panel": {
        "height": 1,
        "width": 1
      },
      "eps_eff": 0.5,
      "battery": {
        "capacity": 3.0,
        "charge": 1
      },
      "power_draw": 10,
      "laser_panel": {
        "height": 1,
        "width": 2
      }
    },
    {
      "id": "VIPER2",
      "location": {
        "lat": 80,
        "long": 30
      },
      "solar_panel": {
        "height": 1,
        "width": 2
      },
      "eps_eff": 0.5,
      "battery": {
        "capacity": 5.0,
        "charge": 1
      },
      "power_draw": 80,
      "laser_panel": {
        "height": 1,
        "width": 2
      }
    }
  ],
  "satellites": [
    {
      "id": "Spark1",
      "orbit": 0,
      "solar_panel_area": 80,
      "eps_eff": 0.5,
      "battery": {
        "capacity": 5.0,
        "charge": 1
      },
      "veh_power_draw": 80,
      "lasers": [
        {
          "eff": 0.2,
          "output_power": 1000
        },
        {
          "eff": 0.2,
          "output_power": 1000
        },
        {
          "eff": 0.2,
          "output_power": 1000
        },
        {
          "eff": 0.2,
          "output_power": 1000
        }
      ]
    },
    {
      "id": "Spark2",
      "orbit": 90,
      "solar_panel_area": 80,
      "eps_eff": 0.5,
      "battery": {
        "capacity": 5.0,
        "charge": 1
      },
      "veh_power_draw": 80,
      "lasers": [
        {
          "eff": 0.2,
          "output_power": 1000
        },
        {
          "eff": 0.2,
          "output_power": 1000
        },
        {
          "eff": 0.2,
          "output_power": 1000
        },
        {
          "eff": 0.2,
          "output_power": 1000
        }
      ]
    }
  ]
}