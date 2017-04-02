exports.getData = function(req, res){
  var list = {
    data: [
      {
        "email": "1@lol.com",
        "recency": 1,
        "likelihood": 5
      },
      {
        "email": "2@lol.com",
        "recency": 2,
        "likelihood": 0
      },
      {
        "email": "3@lol.com",
        "recency": 1,
        "likelihood": 3
      },
      {
        "email": "4@lol.com",
        "recency": 3,
        "likelihood": 2
      }
    ]
  };

  res.send(list);
};

exports.postData = function(req, res){
  
  var newEmail = req.body.email;
  var newRecency = req.body.recency;
  var newLikelihood = req.body.likelihood;
  
  var newBusser = new Busser({
    email: newEmail,
    recency: newRecency,
    likelihood: newLikelihood
  });
  
  newBusser.save(function (err) {
    if (err) return handleError(err);
    
    // saved!
    console.log("saved new busser: " + newEmail);
    // var bussers;
    Busser.find(function (err, bussers) {
      if (err) return console.error(err);
      res.send(bussers);
    });
  })
};