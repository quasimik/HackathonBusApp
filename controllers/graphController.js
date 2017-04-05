// Requires
var util = require("util");
var async = require("async");
var createNormalDist = require("distributions-normal");

// Models
var Busser = require("../models/busser").Busser;

exports.showGraph = function(req, res) {
  
  var location = req.params.location;
  var sen_total = [];
  var sen_went = [];
  
  // Construct asynchoronous Mongoose call stack
  var calls = [];
  [1, 2, 3, 4, 5].forEach(function(sen) {
    calls.push(function(callback) {
      
      // count total for this sentiment bracket
      Busser.count({location: location, sentiment: sen}, function(err, result) {
        if (err) return callback(err);
        // console.log("total[" + sen + "]: " + result);
        sen_total[sen] = result;
        callback(null);
      });
      
    });
    calls.push(function(callback) {
      
      // count went for this sentiment bracket
      Busser.count({location: location, sentiment: sen, went: 1}, function(err, result) {
        if (err) return callback(err);
        // console.log("went[" + sen + "]: " + result);
        sen_went[sen] = result;
        callback(null);
      });
      
    });
  });
  
  // Run call stack in parallel
  async.parallel(calls, function(err) {
    
    // When call stack is finished executing (or error)
    if (err) return console.log(err);
    // console.log("done");
    // console.log(util.inspect(sen_total));
    // console.log(util.inspect(sen_went));
    
    // Calculate normal distribution parameters
    var mean_sum = 0;
    var variance_sum = 0;
    var empty_flag = true;
    // For each sentiment
    [1, 2, 3, 4, 5].forEach(function(sen) {
      if (sen_total[sen] == 0) return;
      empty_flag = false;
      var p_sen = sen_went[sen] / sen_total[sen];
      mean_sum += sen_total[sen] * p_sen; // binomial -> normal approximation: mean = np
      variance_sum += sen_total[sen] * p_sen * (1 - p_sen); // binomial -> normal approximation: variance = np(1-p)
      // console.log("mean_sum: " + mean_sum + ", variance_sum: " + variance_sum);
    });
    if (empty_flag) res.end("No data found for " + location);
    
    // Generate normal distribution and render graph page
    var busserDist = createNormalDist()
      .mean(mean_sum)
      .variance(variance_sum);
    // TODO: continuity correction
    
    var cdf = busserDist.cdf();
    var n_total = 0;
    sen_total.forEach(function(sen) { n_total += sen; });
    var cdf_plot = { x: [], y: [], type: "scatter" };
    for (var i = 0; i < n_total + 1; i++) {
      cdf_plot.x[i] = i;
      cdf_plot.y[i] = cdf(i) * 100;
    }
    // console.log(util.inspect(cdf_plot));
    
    res.render("graph", {cdf_plot: JSON.stringify(cdf_plot)});
  });

};
