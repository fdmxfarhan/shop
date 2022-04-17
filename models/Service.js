var mongoose = require('mongoose');

var ServiceSchema = new mongoose.Schema({
  title: String, 
  
});

var Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;


