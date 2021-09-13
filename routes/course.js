var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Course = require('../models/Course');
const mail = require('../config/mail');
const dateConvert = require('../config/dateConvert');

router.get('/', (req, res) => {
    res.render('./course/course-list');
});

router.get('/course-view', (req, res) => {
    var {courseID} = req.query;
    Course.findById(courseID, (err, course) => {
        res.render('./course/course-view',{
            user: req.user,
            course,
            dateConvert
        });
    });
});

module.exports = router;
