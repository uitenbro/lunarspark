//var count = 0;


function updateStripChart(type, index) {
    var canvas = document.getElementById(type+"_"+index+"_stripchart");
    
    // initial setup funcionality
    if (canvas == null) {
      canvas = document.createElement('canvas');
      canvas.id = type + "_" + index + "_stripchart";
      canvas.className = type + "_stripchart";
      ctx = canvas.getContext("2d")
    
      // create initial empty dataset with label
      var dataset0 = {
        label: "Solar",
        data: [],
        borderColor: "rgb(80, 80, 80",
        borderWidth: 1,
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
        
      if (lunarSpark.environment.time_history.length < 1000) {
        slice = 0
      }
      else {
        slice = lunarSpark.environment.time_history.length - 1000
      }
      
      // add value to data array
      if (type == "sat") {
              

        // var chartData = lunarSpark.satellites[index].battery.percent_history.slice(slice).map(function(item) {
        //   return item /10*10; // Multiply each item by 2
        // });

        chart.data.datasets[0].data = lunarSpark.satellites[index].solar_panel.power_output_history.slice(slice).map(function(item) {return item/1000});
        chart.data.datasets[1].data = lunarSpark.satellites[index].battery.percent_history.slice(slice).map(function(item) {return item});
        chart.data.datasets[2].data = lunarSpark.satellites[index].laser_power_draw_duty_cycle_history.slice(slice).map(function(item) {return item/1000});
      }
      else if (type == "veh") {
        chart.data.datasets[0].data = lunarSpark.vehicles[index].solar_panel.power_output_history.slice(slice).map(function(item) {return item/100});
        chart.data.datasets[1].data = lunarSpark.vehicles[index].battery.percent_history.slice(slice).map(function(item) {return item/10});
        chart.data.datasets[2].data = lunarSpark.vehicles[index].laser_panel.power_output_history.slice(slice).map(function(item) {return item/1000});        
      }

      
      // add current time to labels array
      //chart.data.labels.push(lunarSpark.environment.time);

      chart.data.labels = lunarSpark.environment.time_history.slice(slice).map(function(item) {return Math.floor(item)});        
      

      // remove oldest data point if over 100 points
      // if (chart.data.datasets[0].data.length >= 100) {
      //   for (var i=0;i<chart.data.datasets.length;i++) {      
      //     chart.data.datasets[i].data.shift();
      //   }
      //   chart.data.labels.shift();
      // }

      // limit x-axis to the dataset boundaries
      chart.options.scales.x.min = chart.data.labels[0]
      chart.options.scales.x.max = chart.data.labels[chart.data.labels.length-1]

      // update chart with new data and x-axis labels
      chart.update();

      // increment counter
      //count++;

      return canvas
}

