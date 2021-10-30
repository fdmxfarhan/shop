var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  title: String, 
  code: String,
  available: Boolean,
  date: Date,
  seen: Number,
  star: Number,
  starNumber: Number,
  category: String, 
  video: Object,
  images: {
    type: [String],
    default: [],
  },
  description: String,
  comments: {
    type: [Object],
    default: [],
  },
  cover: String,
  price: Number,
  lastUpdate: Date,
  properties: {
    type: [Object],
    default: [],
  },
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = Product;


