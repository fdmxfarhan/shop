var mongoose = require('mongoose');

var NewsletterSchema = new mongoose.Schema({
  phone: String,
  date: Date,
  ip: String,
});

var Newsletter = mongoose.model('Newsletter', NewsletterSchema);

module.exports = Newsletter;


