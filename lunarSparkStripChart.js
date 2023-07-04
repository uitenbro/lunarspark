function updateStripChart(type, index) {
    var canvas = document.getElementById(type+"_"+index+"_stripchart");
    
    // initial setup functionality
    if (canvas == null) {
      canvas = document.createElement('canvas');
      canvas.id = type + "_" + index + "_stripchart";
      canvas.className = type + "_stripchart";
      ctx = canvas.getContext("2d")
    
      // create initial empty dataset with label
      var dataset0 = {
        label: "Solar",
        data: [],
        borderColor: "rgb(0, 0, 0)",
        borderWidth: 1,
        borderDash: [7, 5],
        fill: false,
        pointRadius: 0, // Remove decorations on data points
        pointHoverRadius: 0
      };      
      var dataset1 = {
        label: "Battery",
        data: [],
        borderColor: "rgb(255, 255, 255",
        borderWidth: 1,
        fill: false,
        pointRadius: 0, // Remove decorations on data points
        pointHoverRadius: 0
      };
      var dataset2 = {
        label: "Laser",
        data: [],
        borderColor: "rgb(0, 0, 0",
        borderWidth: 1,
        fill: false,
        pointRadius: 0, // Remove decorations on data points
        pointHoverRadius: 0
      };

      // create initial chart with empty dataset and x-axis labels
      var chart = new Chart(ctx, {
          type: "line",
          data: {
            datasets: [dataset0, dataset1, dataset2],
            labels: [],
          },
          options: {  
            animation: false,
            plugins: {
              legend: {
                labels: {
                  color: "white"
                }
              }
            },
            scales: {
              x: {
                type: "linear",
                ticks: {
                  color: "white",
                  maxTicksLimit: 10
                },
                title: {
                  display: true,
                  text: "Time",
                  color: "white"
                },
                grid: {
                  color: "rgba(255,255,255,0.2)",
                  borderColor: "white"
                }
              },
              y: {
                ticks: {
                  display: false,
                  color: "white"
                },
                title: {
                  display: false,
                  text: "Value",
                  color: "white"
                },
                grid: {
                  color: "rgba(255,255,255,0.2)",
                  borderColor: "white"
                }
              }
            }
          }
        })
      }

      // cyclic update funcionality
      var chart = Chart.getChart(canvas)
        
      if (lunarSpark.environment.time_history.length < 250) {
        slice = 0
      }
      else {
        slice = lunarSpark.environment.time_history.length - 250
      }
      
      // add value to data array
      if (type == "sat") {
        chart.data.datasets[0].data = lunarSpark.satellites[index].solar_panel.power_output_history.slice(slice).map(function(item) {return item/1000});
        chart.data.datasets[1].data = lunarSpark.satellites[index].battery.percent_history.slice(slice).map(function(item) {return item});
        chart.data.datasets[2].data = lunarSpark.satellites[index].laser_power_draw_duty_cycle_history.slice(slice).map(function(item) {return item/1000});
      }
      else if (type == "veh" && lunarSpark.vehicles[index].active == true) {
        chart.data.datasets[0].data = lunarSpark.vehicles[index].solar_panel.power_output_history.slice(slice).map(function(item) {return item/1000});
        chart.data.datasets[1].data = lunarSpark.vehicles[index].battery.percent_history.slice(slice).map(function(item) {return item/10});
        chart.data.datasets[2].data = lunarSpark.vehicles[index].laser_panel.power_output_history.slice(slice).map(function(item) {return item/1000});        
      }

      // add current time to labels array
      chart.data.labels = lunarSpark.environment.time_history.slice(slice).map(function(item) {return Math.floor(item)});        

      // limit x-axis to the dataset boundaries
      chart.options.scales.x.min = chart.data.labels[0]
      chart.options.scales.x.max = chart.data.labels[chart.data.labels.length-1]
      //chart.options.scales.y.max = 0
      if (type == "sat") {
        chart.options.scales.y.max = 100
      }
      else {
        chart.options.scales.y.max = 10
      }
      // update chart with new data and x-axis labels
      chart.update();

      return canvas
}

function updateSimStatusStripChart(type,total=false) {
    var canvas = document.getElementById(type+"_stripchart");
    
    // initial setup functionality
    if (canvas == null) {
      canvas = document.createElement('canvas');
      canvas.id = type+"_stripchart";
      canvas.className = type + "_stripchart";
      ctx = canvas.getContext("2d")
    
      // create initial empty dataset with label
      var dataset0 = {
        label: "",
        data: [],
        borderColor: "rgb(255, 255, 255)",
        borderWidth: 1,
        fill: false,
        pointRadius: 0, // Remove decorations on data points
        pointHoverRadius: 0
      };      
      var dataset1 = {
        label: "",
        data: [],
        borderColor: "rgb(255, 255, 255",
        borderWidth: 1,
        borderDash: [2, 3],
        fill: false,
        pointRadius: 0, // Remove decorations on data points
        pointHoverRadius: 0
      };
      // var dataset2 = {
      //   label: "L",
      //   data: [],
      //   borderColor: "rgb(255, 255, 255",
      //   borderWidth: 1,
      //   borderDash: [5, 7],
      //   fill: false,
      //   pointRadius: 0, // Remove decorations on data points
      //   pointHoverRadius: 0
      // };
      // var dataset3 = {
      //   label: "Laser Panel Usable",
      //   data: [],
      //   borderColor: "rgb(255, 255, 255",
      //   borderWidth: 1,
      //   fill: false,
      //   pointRadius: 0, // Remove decorations on data points
      //   pointHoverRadius: 0
      // };

      // create initial chart with empty dataset and x-axis labels
      var chart = new Chart(ctx, {
          type: "line",
          data: {
            datasets: [dataset0, dataset1],
            labels: [],
          },
          options: {  
            animation: false,
            responsive: true,            // Allow the chart to be responsive
            maintainAspectRatio: false,  // Do not maintain the aspect ratio
            plugins: {
              legend: {
                labels: {
                  color: "white"
                }
              }
            },
            scales: {
              x: {
                type: "linear",
                ticks: {
                  color: "white",
                  maxTicksLimit: 10
                },
                title: {
                  display: true,
                  text: "Time",
                  color: "white"
                },
                grid: {
                  color: "rgba(255,255,255,0.2)",
                  borderColor: "white"
                }
              },
              y: {
                ticks: {
                  display: true,
                  color: "white"
                },
                title: {
                  display: true,
                  text: "Value",
                  color: "white"
                },
                grid: {
                  color: "rgba(255,255,255,0.2)",
                  borderColor: "white"
                }
              }
            }
          }
        })
      }

      // cyclic update funcionality
      var chart = Chart.getChart(canvas)
      
      if (total != true) {
        if (lunarSpark.environment.time_history.length < 1000) {
          slice = 0
        }
        else {
          slice = lunarSpark.environment.time_history.length - 1000
        }
      }
      else {
        slice = 0
      }

      // add value to data array
      if (type == "ttl") {
        chart.data.datasets[0].data = lunarSpark.environment.ttl_below_threshold_history.slice(slice).filter(function(_, index) {return (index ) % 10 === 0;}).map(function(item) {return item});
        chart.data.datasets[1].data = lunarSpark.environment.ttl_below_zero_history.slice(slice).filter(function(_, index) {return (index ) % 10 === 0;}).map(function(item) {return item});
        chart.data.datasets[0].label = "TTL Below Threshold"
        chart.data.datasets[1].label = "TTL Below Zero"
        chart.options.scales.y.title.text = "min"
      }
      else if (type == "efficiency") {
        chart.data.datasets[0].data = lunarSpark.environment.delivered_efficiency_history.slice(slice).filter(function(_, index) {return (index ) % 10 === 0;});
        chart.data.datasets[1].data = lunarSpark.environment.overall_efficiency_history.slice(slice).filter(function(_, index) {return (index ) % 10 === 0;});
        chart.data.datasets[0].label = "Delivered Efficiency"
        chart.data.datasets[1].label = "Usable Efficiency"     
        chart.options.scales.y.title.text = "% Efficiency"
      }
      else if (type == "capacity") {
        chart.data.datasets[0].data = lunarSpark.environment.excess_laser_panel_energy_history.slice(slice).filter(function(_, index) {return (index ) % 10 === 0;}).map(function(item) {return item/1000});
        chart.data.datasets[1].data = lunarSpark.environment.cumulative_undelivered_laser_capacity_history.slice(slice).filter(function(_, index) {return (index ) % 10 === 0;}).map(function(item) {return item/1000});
        chart.data.datasets[0].label = "Excess Laser Panel Out"
        chart.data.datasets[1].label = "Undelivered Laser Capacity"
        chart.options.scales.y.title.text = "kWh"
      }

      // add current time to labels array
      chart.data.labels = lunarSpark.environment.time_history.slice(slice).filter(function(_, index) {return (index ) % 10 === 0;});;        

      // limit x-axis to the dataset boundaries
      chart.options.scales.x.min = chart.data.labels[0]
      chart.options.scales.x.max = chart.data.labels[chart.data.labels.length-1]
      chart.options.scales.y.min = 0

      chart.update();

      return canvas
}


function updateTtlDeliveryStripChart(type, total) {
    var canvas = document.getElementById(type+"_stripchart");
    
    // initial setup functionality
    if (canvas == null) {
      canvas = document.createElement('canvas');
      canvas.id = type+"_stripchart";
      canvas.className = type + "_stripchart";
      ctx = canvas.getContext("2d")
    
      var datasets = []
      var lineColors = ["rgb(255, 255, 255)", "rgb(0, 255, 255)", "rgb(255, 0, 255)", "rgb(255, 255, 0)", 
                        "rgb(0, 255, 0)",     "rgb(255, 0, 0)",   "rgb(0, 0, 255)",   "rgb(255, 165, 0)"]
      for (var i=0; i<lunarSpark.vehicles.length; i++) {
        // create initial empty dataset with label
        if (lunarSpark.vehicles[i].active == true)
          var dataset  = {
            label: "Veh "+i+" TTL",
            data: [],
            borderColor: lineColors[i],
            borderWidth: 1,
            fill: false,
            pointRadius: 0, // Remove decorations on data points
            pointHoverRadius: 0
          };     
          datasets[i] = dataset 
      }
      
      // create initial chart with empty dataset and x-axis labels
      var chart = new Chart(ctx, {
          type: "line",
          data: {
            datasets: datasets,
            labels: [],
          },
          options: {  
            animation: false,
            responsive: true,            // Allow the chart to be responsive
            maintainAspectRatio: false,  // Do not maintain the aspect ratio
            plugins: {
              legend: {
                labels: {
                  color: "white"
                }
              }
            },
            scales: {
              x: {
                type: "linear",
                ticks: {
                  color: "white",
                  maxTicksLimit: 10
                },
                title: {
                  display: true,
                  text: "Time",
                  color: "white"
                },
                grid: {
                  color: "rgba(255,255,255,0.2)",
                  borderColor: "white"
                }
              },
              y: {
                ticks: {
                  display: true,
                  color: "white"
                },
                title: {
                  display: true,
                  text: "min",
                  color: "white"
                },
                grid: {
                  color: "rgba(255,255,255,0.2)",
                  borderColor: "white"
                }
              }
            }
          }
        })
      }

      // cyclic update funcionality
      var chart = Chart.getChart(canvas)
      
      if (total != true) {
        if (lunarSpark.environment.time_history.length < 1000) {
          slice = 0
        }
        else {
          slice = lunarSpark.environment.time_history.length - 1000
        }

        var ttlMin = 21500 // arbitrary large number of min > 14.5 days
        // add value to data array
        if (type == "veh_ttl") {
          for (var i=0; i<lunarSpark.vehicles.length; i++) {
            if (lunarSpark.vehicles[i].active == true) {
              chart.data.datasets[i].data = lunarSpark.vehicles[i].ttl_history.slice(slice).map(function(item) {return item});
              if (lunarSpark.vehicles[i].location.in_night || lunarSpark.vehicles[i].location.in_shadow) {
                if (lunarSpark.vehicles[i].ttl_history[lunarSpark.vehicles[i].ttl_history.length-1] < ttlMin && 
                  lunarSpark.vehicles[i].ttl_history[lunarSpark.vehicles[i].ttl_history.length-1] != 0) { 
                  ttlMin = lunarSpark.vehicles[i].ttl_history[lunarSpark.vehicles[i].ttl_history.length-1]
                }
              }
            }
          }
        }
        
        // add current time to labels array
        chart.data.labels = lunarSpark.environment.time_history.slice(slice);;        

        // limit x-axis to the dataset boundaries
        chart.options.scales.x.min = chart.data.labels[0]
        chart.options.scales.x.max = chart.data.labels[chart.data.labels.length-1]

        // zoom y-scale to minimum TTL area of interest
        if ((ttlMin - 800) < 0) {
          chart.options.scales.y.min = 0
        }
        else {
          chart.options.scales.y.min = Math.floor(ttlMin - 800)
        }
        chart.options.scales.y.max = Math.floor(ttlMin + 800)
      }
      else {
        slice = 0
        if (type == "veh_ttl") {
          for (var i=0; i<lunarSpark.vehicles.length; i++) {
            if (lunarSpark.vehicles[i].active == true) {
              chart.data.datasets[i].data = lunarSpark.vehicles[i].ttl_history.slice(slice).filter(function(_, index) {return (index ) % 10 === 0;}).map(function(item) {return item});
            }
          }
      
          // add current time to labels array
          chart.data.labels = lunarSpark.environment.time_history.slice(slice).filter(function(_, index) {return (index ) % 10 === 0;});;        

          // limit x-axis to the dataset boundaries
          chart.options.scales.x.min = chart.data.labels[0]
          chart.options.scales.x.max = chart.data.labels[chart.data.labels.length-1]
          chart.options.scales.y.min = 0
        }
      }

      chart.update();

      return canvas
}