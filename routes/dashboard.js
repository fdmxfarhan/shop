var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Course = require('../models/Course');
const mail = require('../config/mail');

router.get('/', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'user')
    {
        res.render('./dashboard/user-dashboard', {
            user: req.user,
            login: req.query.login,
        });
    }
    else if(req.user.role = 'admin')
    {
        Course.find({}, (err, courses) => {
            res.render('./dashboard/admin-dashboard', {
                user: req.user,
                login: req.query.login,
                courses
            });
        })
    }
});

router.post('/complete-info', ensureAuthenticated, (req, res, next) => {
    var {firstName, lastName, idNumber, email, address} = req.body;
    var fullname = firstName + ' ' + lastName;
    User.updateMany({_id: req.user._id}, {$set: {firstName, lastName, idNumber, email, address, fullname, completed: true}}, (err) => {
        res.redirect('/dashboard')
    });
});





module.exports = router;


