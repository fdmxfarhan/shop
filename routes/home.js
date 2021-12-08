var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Setting = require('../models/Setting');
var Course = require('../models/Course');

router.get('/', (req, res, next) => {
    Course.find({}, (err, courses) => {
        Setting.findOne({}, (err, setting) => {
            res.render('home', {
                user: req.user,
                setting,
                courses,
            });
        })
    })
});

module.exports = router;
