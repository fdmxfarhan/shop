var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Setting = require('../models/Setting');
var Course = require('../models/Course');
var Product = require('../models/Product');
var Newsletter = require('../models/Newsletter');
const sms = require('../config/sms');

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
router.post('/newsletter', (req, res, next) => {
    var {phone} = req.body;
    Newsletter.findOne({phone}, (err, newsletter) => {
        sms(phone, 
            'عضویت در خبرنامه\n\n' +
            'عضویت در خبرنامه با موفقیت انجام شد.\n' +
            'آکادمی فناورانه'
            );
        if(newsletter) {
            res.render('newsletter');
        }
        else{
            var newNewsletter = new Newsletter({phone, date: new Date()});
            newNewsletter.save().then(doc => {
                res.render('newsletter');
            }).catch(err => console.log(err));
        }
    });
});

router.get('/search', (req, res, next) => {
    res.render('search', {
        user: req.user,
    });
});

var searchCourse = (word, course) => {
    if(course.title.indexOf(word) != -1) return true;
    if(course.producer.indexOf(word) != -1) return true;
    if(course.stage.indexOf(word) != -1) return true;
    if(course.supportNumber.indexOf(word) != -1) return true;
    if(course.description.indexOf(word) != -1) return true;
    return false;
}
var searchProduct = (word, product) => {
    if(product.title.indexOf(word) != -1) return true;
    if(product.category.indexOf(word) != -1) return true;
    if(product.description.indexOf(word) != -1) return true;
    return false;
}

router.post('/search', (req, res, next) => {
    var {text} = req.body;
    Course.find({}, (err, courses) => {
        Product.find({}, (err, products) => {
            coursesList = [];
            for(var i=0; i<courses.length; i++){
                if(searchCourse(text, courses[i]))
                    coursesList.push(courses[i]);
            }
            productsList = [];
            for(var i=0; i<products.length; i++){
                if(searchProduct(text, products[i]))
                    productsList.push(products[i]);
            }
            res.render('search', {
                user: req.user,
                coursesList,
                productsList,
                text,
            });
        });
    });
});

module.exports = router;
