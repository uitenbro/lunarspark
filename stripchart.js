// initialize empty arrays for data and x-axis labels
var data = [];
var data1 = [];
var labels = [];
var count = 0;
//var chart;

function updateStripChart(index) {
    //var ctx = document.getElementById(canvasName).getContext("2d");

    var canvas = document.createElement('canvas');
    canvas.id = "sat_" + index + "_stripchart";
    canvas.className = "satellite_stripchart";

    // create initial empty dataset with label
    var dataset = {
      label: "Value",
      data: data,
      borderColor: "rgb(255, 255, 255",
      borderWidth: 1,
      fill: false,
    };
    var dataset1 = {
      label: "Value 1",
      data: data1,
      borderColor: "rgb(0, 0, 0",
      borderWidth: 1,
      fill: false,
    };

    // create initial chart with empty dataset and x-axis labels
    var chart = new Chart(canvas, {
        type: "line",
        data: {
          datasets: [dataset, dataset1],
          labels: labels,
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

      // calculate value based on current time
      var time = Date.now() 
      var value = Math.sin(count/10);

      // add value to data array
      data.push(value);
            // add value to data array
      data1.push(-value);

      // add current time to labels array
      labels.push(count);

      // remove oldest data point if over 250 points
      if (data.length >= 100) {
        data.shift();      
        data1.shift();
        labels.shift();
        chart.options.scales.x.min = labels[0]
        chart.options.scales.x.max = labels[0]+100
      }
      else {
        chart.options.scales.x.min = 0
        chart.options.scales.x.max = 100
      }

      // update chart with new data and x-axis labels
      chart.update();

      // increment counter
      count++;

      return canvas

}

