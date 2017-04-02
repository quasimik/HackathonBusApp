var express = require("express");
var app = express();

// Requires
var util = require("util");
var multiparty = require("multiparty");
var path = require("path");
var bodyParser = require("body-parser");

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
  });
  res.send("deleted");
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

app.get("/graph", function(req, res) {
  
});

app.listen(3000);
console.log("running...");
