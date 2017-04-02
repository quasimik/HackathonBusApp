var app = require("express")();
var util = require("util");
var multiparty = require("multiparty");

app.set("view engine", "pug");

var bodyParser = require("body-parser");
app.use(bodyParser.json());

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
  email: String,
  recency: Number,
  likelihood: Number
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

// app.post("/form", function(req, res){
//   var form = new multiparty.Form();

//   form.parse(req, function(err, fields) {
//     res.writeHead(200, {'content-type': 'text/plain'});
//     res.write('received upload:\n\n');
//     res.end(util.inspect({fields: fields}));
    
//   });
  
// });

app.get("/data", dataController.getData);

app.post("/data", function(req, res){
  
  var form = new multiparty.Form();
  // var email = req.body.busser.email;
  // var recency = req.body.busser.recency;
  // var likelihood = req.body.busser.likelihood;
  form.parse(req, function(err, fields) {
    
    var newBusser = new Busser({
      email: fields.email,
      recency: Number(fields.recency),
      likelihood: Number(fields.likelihood)
    });
    
    newBusser.save(function (err) {
      console.log(err);
      if (err) return console.log(err);
      
      // saved!
      console.log("saved new busser: " + fields.recency);
      // var bussers;
      Busser.find(function (err, bussers) {
        if (err) return console.error(err);
        res.send(bussers);
      });
    });
  });
  
  
  
});

// app.patch("/data", dataController.patchData);

app.delete("/data", function(req, res){
  Busser.remove({}, function(err) { 
    console.log('collection removed') ;
  });
});

app.listen(3000);
console.log("running...");

// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// // var index = require('./routes/index');
// // var users = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // app.use('/', index);
// // app.use('/users', users);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
