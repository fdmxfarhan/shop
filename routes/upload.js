var express = require('express');
var path = require('path');
var router = express.Router();
var bodyparser = require('body-parser');
const multer = require('multer');
const mail = require('../config/mail');
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Product = require('../models/Product');
const mkdirp = require('mkdirp');
const generateCode = require('../config/generateCode');

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

router.post('/add-course', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    var { title, producer, time, stage, supportNumber, subtitle, support, price, description } = req.body;
    if(subtitle) subtitle = true;
    else         subtitle = false;
    if(support) support = true;
    else         support = false;
    
    if (!file) {
        res.send('no file to upload');
    } else {
        var cover = file.destination.slice(6) + '/' + file.originalname;
        const newCourse = new Course({ title, producer, time, stage, supportNumber, subtitle, support, price, description, cover, lastUpdate: new Date() });
        newCourse.save()
            .then(course => {
                // res.redirect('/dashboard');
                res.redirect(`/course/course-view?courseID=${newCourse._id}`);
            }).catch(err => {
                if (err) console.log(err);
            });
    }
});

router.post('/add-product', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    var { title, category, available, price, description } = req.body;
    if(available) available = true;
    else         available = false;
    
    if (!file) {
        res.send('no file to upload');
    } else {
        var cover = file.destination.slice(6) + '/' + file.originalname;
        const newProduct = new Product({ title, category, available, price, description, cover, lastUpdate: new Date() });
        newProduct.save()
            .then(product => {
                res.redirect(`/product/product-view?productID=${newProduct._id}`);
            }).catch(err => {
                if (err) console.log(err);
            });
    }
});
router.post('/product-image', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    var {productID} = req.body;
    if (!file) res.send('no file to upload');
    else {
        var image = file.destination.slice(6) + '/' + file.originalname;
        Product.findById(productID, (err, product) => {
            var images = product.images;
            images.push(image);
            Product.updateMany({_id: productID}, {$set: {images}}, (err, doc) => {
                res.redirect(`/product/product-view?productID=${productID}`)
            })
        })
    }
});

router.post('/course-cover', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    const { courseID } = req.body;
    if (!file) {
        res.send('no file to upload');
    } else {
        var cover = file.destination.slice(6) + '/' + file.originalname;
        Course.updateMany({_id: courseID}, {$set: {cover}}, (err, doc) => {
            req.flash('success_msg', 'کاور با موفقیت آپلود و ذخیره شد.');
            res.redirect(`/dashboard/admin-edit-course?courseID=${courseID}`);
        });
    }
});

router.post('/session', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    var file = req.file;
    var { courseID, title, time, locked } = req.body;
    if(locked) locked = true;
    else       locked = false;
    if (!file) {
        res.send('no file to upload');
    } else {
        var link = file.destination.slice(6) + '/' + file.originalname;
        Course.findById(courseID, (err, course) => {
            var sessions = course.sessions;
            sessions.push({title, link, time, locked});
            Course.updateMany({_id: courseID}, {$set: {sessions}}, (err, doc) => {
                req.flash('success_msg', 'کاور با موفقیت آپلود و ذخیره شد.');
                res.redirect(`/course/course-view?courseID=${courseID}`);
            });
        })
    }
});


module.exports = router;