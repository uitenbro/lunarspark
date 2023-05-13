// initialize empty arrays for data and x-axis labels
var data = [];
var data1 = [];
var labels = [];
var count = 0;
var chart;

function createStripChart(canvas) {
    //var ctx = document.getElementById(canvasName).getContext("2d");

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
    return chart
}

function updateStripChart(chart) {
      // calculate value based on current time
      var time = Date.now() 
      var value = Math.sin(count/10);

      // add value to data array
      data.push(value);
            // add value to data array
      data1.push(-value);

      // add current time to labels array
      labels.push(count);

      // remove oldest data point if over 200 points
      // if (data.length > 100) {
      //   data.shift();
      //   labels.shift();
      // }

      // update chart with new data and x-axis labels
      //  chart.update();

      // increment counter
      count++;

}

