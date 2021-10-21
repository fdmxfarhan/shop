var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Setting = require('../models/Setting');

router.get('/', (req, res, next) => {
    Setting.findOne({}, (err, setting) => {
        res.render('home', {
            user: req.user,
            setting,
        });
    })
});

module.exports = router;
