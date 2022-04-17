var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: String, 
  producer: String,
  time: String,
  stage: String,  // mobtadi, pishrafte ina
  subtitle: {
    type: Boolean,
    default: false,
  },
  support: {
    type: Boolean,
    default: false,
  },
  supportNumber: String,
  lastUpdate: Date,
  seen: {
    type: Number,
    default: 0,
  },
  description: String,
  intro: Object,  // {type, src}
  sessions: {
    type: [Object],
    default: [],
  },
  comments: {
    type: [Object],
    default: [],
  },
  price: Number,
  fullPrice: {type: String, default: ''},
  cover: String,
  status: String, // {title, locked, time, video, description}
  star: {
    type: Number,
    default: 0,
  },
  showInHome: {
    type: Boolean,
    default: false,
  },
});

var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;


