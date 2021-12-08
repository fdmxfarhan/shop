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

Setting.findOne({}, (err, setting) => {
    if(!setting){
        var newSetting = new Setting();
        newSetting.save().then(doc => console.log('settings saved :)')).catch(err => console.log(err));
    }
    else if(!setting.background){
        Setting.deleteMany({}, (err, doc) => {
            var newSetting = new Setting();
            newSetting.save().then(doc => console.log('settings saved :)')).catch(err => console.log(err));
        })
    }
})
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = 'public/img/';
        mkdirp(dir, err => cb(err, dir));
    },
    filename: function(req, file, cb) {
        cb(null, 'logo.png')
    }
});

var upload = multer({ storage: storage });

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
router.post('/set-logo', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    if (!file) res.send('no file to upload');
    else {
        res.redirect('/dashboard/home-setting');
    }
});


module.exports = router;