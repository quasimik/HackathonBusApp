// Express
var express = require("express");
var app = express();

// Requires
var util = require("util");
var multiparty = require("multiparty");
var path = require("path");
var bodyParser = require("body-parser");
var createNormalDist = require("distributions-normal");
var async = require("async");

// Uses
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.set("view engine", "pug");

// Mongoose
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to mongodb");
});

// Mongoose Schema for busser
var Schema = mongoose.Schema;
var busserSchema = new Schema({
  name: String,
  email: String,
  recency: Number,
  sentiment: Number,
  location: String,
  went: Boolean
});
var Busser = mongoose.model("Busser", busserSchema);

// Controllers
var dataController = require("./dataController");

// HTTP Methods
app.get("/", function(req, res){
  res.end("Hello World");
});

app.get("/graph/:location", function(req, res) {
  
  var location = req.params.location;
  // var location = "UCLA";
  var sen_total = [];
  var sen_went = [];
  
  // Construct asynchoronous Mongoose call stack
  var calls = [];
  [1, 2, 3, 4, 5].forEach(function(sen) {
    calls.push(function(callback) {
      
      // count total for this sentiment bracket
      Busser.count({location: location, sentiment: sen}, function(err, result) {
        if (err) return callback(err);
        console.log("total[" + sen + "]: " + result);
        sen_total[sen] = result;
        callback(null);
      });
      
    });
    calls.push(function(callback) {
      
      // count went for this sentiment bracket
      Busser.count({location: location, sentiment: sen, went: 1}, function(err, result) {
        if (err) return callback(err);
        console.log("went[" + sen + "]: " + result);
        sen_went[sen] = result;
        callback(null);
      });
      
    });
  });
  
  // Run call stack in parallel
  async.parallel(calls, function(err) {
    
    // When call stack is finished executing (or error)
    if (err) return console.log(err);
    console.log("done");
    console.log(util.inspect(sen_total));
    console.log(util.inspect(sen_went));
    
    // Calculate normal distribution parameters
    var mean_sum = 0;
    var variance_sum = 0;
    // For each sentiment
    [1, 2, 3, 4 , 5].forEach(function(sen) {
      var p_sen = sen_went[sen] / sen_total[sen];
      mean_sum += sen_total[sen] * p_sen; // binomial -> normal approximation: mean = np
      variance_sum += sen_total[sen] * p_sen * (1 - p_sen); // binomial -> normal approximation: variance = np(1-p)
    });
    console.log("mean_sum: " + mean_sum + ", variance_sum: " + variance_sum);
    
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
    console.log(util.inspect(cdf_plot));
    
    res.render("graph", {cdf_plot: JSON.stringify(cdf_plot)});
  });

});

app.get("/form", function(req, res){
  res.render("form");
});

// app.get("/data", dataController.getData);

app.get("/data", function(req, res) {
  
  var sentimentFilter = req.query.sentiment;
  var locationFilter = req.query.location;
  var wentFilter = req.query.went;
  
  if (typeof sentimentFilter === 'undefined' &&
      typeof locationFilter === 'undefined' &&
      typeof wentFilter === 'undefined') {
    Busser.find(function (err, bussers) {
      if (err) return console.error(err);
      res.send(bussers);
    });
  }
  else {
    var filter = {};
    if (typeof sentimentFilter !== 'undefined') {
      filter.sentiment = sentimentFilter;
    }
    if (typeof locationFilter !== 'undefined') {
      filter.location = locationFilter;
    }
    if (typeof wentFilter !== 'undefined') {
      filter.went = wentFilter;
    }
    Busser.count(filter, function (err, count) {
      if (err) return console.error(err);
      res.send(String(count));
    });
  }
  
});

app.post("/data", function(req, res){
  
  var form = new multiparty.Form();
  // var email = req.body.busser.email;
  // var recency = req.body.busser.recency;
  // var sentiment = req.body.busser.sentiment;
  form.parse(req, function(err, fields) {
    
    console.log(util.inspect(fields));
    // res.send();
    var newBusser = new Busser({
      name: fields.name,
      email: fields.email,
      recency: 1,
      sentiment: Number(fields.sentiment),
      location: fields.location
    });
    
    newBusser.save(function (err) {
      console.log(err);
      if (err) return console.log(err);
      
      // saved!
      console.log("saved new busser: " + util.inspect(newBusser));
      // var bussers;
      Busser.find(function (err, bussers) {
        if (err) return console.error(err);
        res.send(bussers);
      });
    });
  });
});

// app.patch("/data", dataController.patchData);

app.get("/data-delete", function(req, res) {
  Busser.remove({}, function(err) { 
    console.log('deleted');
    res.send("deleted");
  });
});

app.get("/data-gen", function(req, res) {
  Busser.remove({}, function(err) { 
    console.log('deleted');
  });
  
  var locations = [ "UCLA", "UCSD", "USC" ];
  
  for (i = 0; i < 140; i++) {
    var newBusser = new Busser({
      name: "NameSon McNameName",
      email: "email@lol.kek",
      recency: Math.floor(Math.random() * 3) + 1, // 1-3
      sentiment: Math.floor(Math.random() * 5) + 1, // 1-5
      location: locations[Math.floor(Math.random() * locations.length)],
      went: Math.floor(Math.random() * 2)
    });
    
    newBusser.save(function (err) {
      if (err) return console.log(err);
    });
  }
  console.log('generated');
  res.send("done");
});

app.listen(3000);
console.log("running...");
