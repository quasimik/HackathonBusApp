var Plotly = require("plotly.js");
var cdf_plot_o = JSON.parse(cdf_plot_str);
// console.log(cdf_plot_o);

var data = [cdf_plot_o];

Plotly.newPlot('graphDiv', data);