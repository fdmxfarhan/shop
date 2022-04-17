var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
  title: String, 
  
});

var News = mongoose.model('News', NewsSchema);

module.exports = News;


