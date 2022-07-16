var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Course = require('../models/Course');
var News = require('../models/News');
var Service = require('../models/Service');
const mail = require('../config/mail');
const dateConvert = require('../config/dateConvert');
const { session } = require('passport');

router.get('/', (req, res) => {
    News.find({}, (err, news) => {
        res.render('./news/news-list',{
            user: req.user,
            news,
            dateConvert,
        });
    })
});

router.get('/news-view', (req, res, next) => {
    var {serviceID} = req.query;
    Service.findById(serviceID, (err, service) => {
        res.render('./news/news-view', {
            user: req.user,
            service,
        })
    })
})


module.exports = router;


