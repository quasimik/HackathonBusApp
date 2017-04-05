// Express
var express = require("express");
var app = express();

// Requires
var path = require("path");
var bodyParser = require("body-parser");

// Uses
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.set("view engine", "pug");

// Mongoose connection
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to mongodb");
});

// Model load

// Controllers
var dataController = require("./controllers/dataController");
var graphController = require("./controllers/graphController");

// HTTP Methods
app.get("/", function(req, res){
  res.end("Hello World");
});
app.get("/form", function(req, res){
  res.render("form");
});
app.get("/graph/:location", graphController.showGraph);

// HTTP methods: data
app.get("/data", dataController.getData);
app.post("/data", dataController.postData);
app.get("/data/delete", dataController.deleteData);
app.get("/data/regen", dataController.regenData);

// Start server
app.listen(3000);
console.log("running...");
