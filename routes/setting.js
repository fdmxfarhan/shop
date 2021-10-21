var express = require('express');
var path = require('path');
var router = express.Router();
var bodyparser = require('body-parser');
const multer = require('multer');
const mail = require('../config/mail');
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Setting = require('../models/Setting');
const mkdirp = require('mkdirp');

router.use(bodyparser.urlencoded({ extended: true }));
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = 'public/files/' + Date.now().toString();
        mkdirp(dir, err => cb(err, dir));
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage });
Setting.findOne({}, (err, setting) => {
    if(!setting) {
        var newSetting = new Setting({});
        newSetting.save().then(doc => {}).catch(err => {if(err) console.log(err)});
    }
})

router.post('/set-contact', ensureAuthenticated, (req, res, next) => {
    var {phone, email} = req.body;
    Setting.updateMany({}, {$set: {phone, email}}, (err, setting) => {
        if(err) console.log(err);
        res.redirect('/dashboard/home-setting');
    });
});
router.post('/set-titles', ensureAuthenticated, (req, res, next) => {
    var {title1, title2, title3} = req.body;
    Setting.updateMany({}, {$set: {title1, title2, title3}}, (err, setting) => {
        if(err) console.log(err);
        res.redirect('/dashboard/home-setting');
    });
});



module.exports = router;