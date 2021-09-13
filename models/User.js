var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  school: String,
  username: String,
  email: String,
  idNumber: String,
  ipAddress: String,
  phone: String,
  education: String,
  fullname: String,
  password: String,
  role: String,
  card: {
    type: Number,
    default: 0,
  },
  sex: String,
  file: {
    type: [Object],
    default: [],
  },
  avatar: Number,
  course: [Object],
  completed: {
    type: Boolean,
    default: false,
  },
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
