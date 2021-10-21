var mongoose = require('mongoose');

var SettingSchema = new mongoose.Schema({
  phone: String,
  email: String,
  title1: String,
  title2: String,
  title3: String,
});

var Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;


