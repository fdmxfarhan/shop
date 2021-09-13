var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: String, 
  producer: String,
  time: String,
  stage: String,  // mobtadi, pishrafte ina
  subtitle: Boolean,
  support: Boolean,
  supportNumber: String,
  lastUpdate: Date,
  seen: Number,
  description: Text,
  intro: Object,  // {type, src}
  sessions: [Object],
  price: Number,
  cover: String,
  status: String, // {title, locked, time, video, description}
  
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;


