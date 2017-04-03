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

app.get("/graph", function(req, res) {
  // Statistics and plotting
  
  // Normal dist parameters
  var busserDist = createNormalDist();
  var mean_sum = 0;
  var variance_sum = 0;
  
  var count = 0;
  for (var i = 0; i < 5; i++) {
    Busser.count({location: "UCLA", sentiment: i}, function(err, n) {
      if (err) return console.error(err);
      if (n === 0) return;
      
      Busser.count({location: "UCLA", sentiment: i, went: 1}, function(err, n_success) {
        if (err) return console.error(err);
        
        var p = n_success / n;
        mean_sum += n * p;
        variance_sum += n * p * (1 - p);
        
        if (i >= 5) {
          busserDist.mean(mean_sum);
          busserDist.variance(variance_sum);
          
          var trace2 = {
            x: [2, 3, 4, 5],
            y: [16, 5, 11, 9],
            mode: 'lines'
          };
          
          var data = [ trace2 ];

          var layout = {
            title:'Line and Scatter Plot'
          };

          Plotly.newPlot('graphDiv', data, layout);
          
          res.render("form");
        }
      });
    });
  }
  
  
  // var count = 0
  // async.whilst(
  //   function() { console.log("count: " + count); return count < 5; },
  //   function() {
  //     count++;
  //     async.series([
        
  //     ],
  //     function(err, results) {
        
  //     });
  //   },
  //   function(err, n) {
  //     console.log("mean_sum");
      
  //     busserDist.mean(mean_sum);
  //     busserDist.variance(variance_sum);
      
  //     res.end();
  //   }
  // );
  
  // async.series([
    
  //   function() {
  //     // Approximate normal distribution for each sentiment
  //     // Combine (convolute) all sentiments' distributions
  //     for (var i = 1; i <= 5; i++) {
  //       console.log("a");
  //       Busser.count({location: "UCLA", sentiment: i}, function(err, n) {
  //         if (err) return console.error(err);
  //         if (n === 0) return;
          
  //         Busser.count({location: "UCLA", sentiment: i, went: 1}, function(err, n_success) {
  //           if (err) return console.error(err);
            
  //           var p = n_success / n;
  //           console.log(i + " p " + p);
  //           mean_sum += n * p;
  //           console.log(i + " 1");
  //           variance_sum += n * p * (1 - p);
  //           console.log(i + " 2");
  //         });
  //         console.log(i + " 3");
          
  //       })
  //     }
  //   },
    
  //   function() {
  //     // Use async to make sure this runs after db calls
  //     // Combined normal distribution
  //     console.log("mean_sum");
      
  //     busserDist.mean(mean_sum);
  //     busserDist.variance(variance_sum);
  //   }
    
  // ]); // ! async
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
