var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  title: String, 
  code: String,
  available: Boolean,
  date: Date,
  seen: {type: Number, default: 0},
  star: {type: Number, default: 0},
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
  fullPrice: {type: String, default: ''},
  lastUpdate: Date,
  properties: {
    type: [Object],
    default: [],
  },
  files: {type: [Object], default: []},
  showInHome: {
    type: Boolean,
    default: false,
  },
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = Product;


