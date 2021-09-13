var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
const mail = require('../config/mail');

router.get('/', (req, res) => {
    res.render('./course/course-list');
});

module.exports = router;
