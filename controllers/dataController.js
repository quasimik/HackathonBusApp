// Requires
var multiparty = require("multiparty");
var util = require("util");

// Models
var Busser = require("../models/busser").Busser;

exports.getData = function(req, res) {
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
};

exports.postData = function(req, res) {
  
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
};

exports.deleteData = function(req, res) {
  Busser.remove({}, function(err) { 
    console.log('data deleted');
    res.send("data deleted");
  });
};

exports.regenData = function(req, res) {
  Busser.remove({}, function(err) { 
    console.log('data deleted');
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
  console.log('data generated');
  res.send("data regenerated");
}