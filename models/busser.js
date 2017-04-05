var mongoose = require("mongoose");

var BusserSchema = new mongoose.Schema({
  name: String,
  email: String,
  recency: Number,
  sentiment: Number,
  location: String,
  went: Boolean
});

var Busser = mongoose.model('Busser', BusserSchema);

module.exports = {
  Busser: Busser
}