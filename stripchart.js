// initialize empty arrays for data and x-axis labels
// var data = [];
// var data1 = [];
// var labels = [];
var count = 0;
// var chart 

function updateStripChart(chart, index) {

    var canvas = document.getElementById("sat_"+index+"_stripchart");

    if (canvas == null) {
      canvas = document.createElement('canvas');
      canvas.id = "sat_" + index + "_stripchart";
      canvas.className = "satellite_stripchart";
      ctx = canvas.getContext("2d")
    
    
      // create initial empty dataset with label
      var dataset = {
        label: "Battery",
        data: [],
        borderColor: "rgb(255, 255, 255",
        borderWidth: 1,
        fill: false,
        pointRadius: 0, // Remove decorations on data points
        pointHoverRadius: 0
      };
      var dataset1 = {
        label: "Anomaly",
        data: [],
        borderColor: "rgb(0, 0, 0",
        borderWidth: 1,
        fill: false,
        pointRadius: 0, // Remove decorations on data points
        pointHoverRadius: 0
      };

      //chart.destroy()
      // create initial chart with empty dataset and x-axis labels
      var chart = new Chart(ctx, {
          type: "line",
          data: {
            datasets: [dataset, dataset1],
            labels: [],
          },
          options: {  
            animation: false,
            plugins: {
              legend: {
                labels: {
                  color: "black"
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

      var chart = Chart.getChart(canvas)

      // calculate value based on current time
      // var time = Date.now() 
      // var value = Math.sin(count/10);

      // add value to data array
      chart.data.datasets[0].data.push(lunarSpark.satellites[index].battery.percent);
      // add value to data array
      chart.data.datasets[1].data.push(lunarSpark.satellites[index].orbit.anomaly.toFixed(1));
      // console.log("sat_"+index+"_stripchart "+lunarSpark.environment.time+" - orbit["+index+"] "+lunarSpark.satellites[index].orbit.anomaly.toFixed(1)+" dataset[1] "+chart.data.datasets[1].data)
      
      // add current time to labels array
      chart.data.labels.push(lunarSpark.environment.time);

      // remove oldest data point if over 100 points
      if (chart.data.datasets[0].data.length >= 100) {
        chart.data.datasets[0].data.shift();      
        chart.data.datasets[1].data.shift();
        chart.data.labels.shift();
      }
        chart.options.scales.x.min = chart.data.labels[0]
        chart.options.scales.x.max = chart.data.labels[chart.data.labels.length-1]
      // }
      // else {
      //   chart.options.scales.x.min = 0
      //   chart.options.scales.x.max = 200
      // }

      // update chart with new data and x-axis labels
      chart.update();

      // increment counter
      count++;

      return canvas

}

