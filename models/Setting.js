var mongoose = require('mongoose');

var SettingSchema = new mongoose.Schema({
  phone: {
    type: String,
    default: '09...',
  },
  email: {
    type: String,
    default: '09...',
  },
  title1: {
    type: String,
    default: 'title',
  },
  title2: {
    type: String,
    default: 'title',
  },
  title3: {
    type: String,
    default: 'title',
  },
  background: {
    type: Object,
    default: {link: '/img/home/gray_aban.mp4', type: 'video'},
  },
});

var Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;


