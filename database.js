var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
    addHacker(db, "UCM", "jessie","jessie@gmail.com", "Y", function() {
    db.close();
  });
});



    
var addHacker = function(db, startLoc, fullName, emailAddress, needBusYorN, callback) {
    db.collection('hacker'+startLoc).insertOne({
	'name': fullName,
	'email': emailAddress,
	'needBus': needBusYorN
    })
	console.log("name: "+fullName +" email: " +emailAddress+" need bus? : "+
		    needBusYorN+ " added to db.");
callback();	

    
};


