var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  createRSVPdata(db, function() {
    db.close();
  });
});



    
var createRSVPdata = function(db, callback) {
  db.createCollection("contacts", 
	   {
	      'validator': { '$or':
	         [
	            { 'name': { '$type': "string" } },
	            { 'email': { '$regex': /@*\.com$/ } },
	            { 'needBus': { '$checked': [ "yes", "no" ] } }
	         ]
	      }
	   },	   
    function(err, results) {
      console.log("Collection created.");
      callback();
    }
  );
};


    
var addData = function(db, callback) {
  db.createCollection("contacts", 
	   {
	      'validator': { '$or':
	         [
	            { 'name': { '$type': "string" } },
	            { 'email': { '$regex': /@*\.com$/ } },
	            { 'needBus': { '$checked': [ "yes", "no" ] } }
	         ]
	      }
	   },	   
    function(err, results) {
      console.log("Collection created.");
      callback();
    }
  );
};

db.products.insert( { item: "card", qty: 15 } )
