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
const Setting = require('../models/Setting');
const mkdirp = require('mkdirp');
const generateCode = require('../config/generateCode');
const fs = require('fs');

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
    var { title, producer, time, stage, supportNumber, subtitle, support, fullPrice, price, description, showInHome } = req.body;
    if(subtitle) subtitle = true;
    else         subtitle = false;
    if(support) support = true;
    else         support = false;
    if(showInHome) showInHome = true;
    else         showInHome = false;
    
    if (!file) {
        res.send('no file to upload');
    } else {
        var cover = file.destination.slice(6) + '/' + file.originalname;
        const newCourse = new Course({ title, showInHome, producer, time, stage, supportNumber, subtitle, support, price, fullPrice, description, cover, lastUpdate: new Date() });
        newCourse.save()
            .then(course => {
                // res.redirect('/dashboard');
                res.redirect(`/course/course-view?courseID=${newCourse._id}`);
            }).catch(err => {
                if (err) console.log(err);
            });
    }
});
router.post('/edit-course', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    var { courseID, title, producer, time, stage, supportNumber, subtitle, support, fullPrice, price, description, showInHome } = req.body;
    if(subtitle) subtitle = true;
    else         subtitle = false;
    if(support) support = true;
    else         support = false;
    if(showInHome) showInHome = true;
    else         showInHome = false;
    
    Course.findById(courseID, (err, course) => {
        var cover = course.cover;
        if(file) cover = file.destination.slice(6) + '/' + file.originalname;
        Course.updateMany({_id: courseID} , {$set: { title, showInHome, producer, time, stage, supportNumber, subtitle, support, fullPrice, price, description, cover, lastUpdate: new Date() }}, (err, doc) => {
            res.redirect(`/course/course-view?courseID=${courseID}`);
        });
    });
});
router.post('/add-product', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    var { title, category, available, price, fullPrice, description, showInHome } = req.body;
    if(available) available = true;
    else         available = false;
    if(showInHome) showInHome = true;
    else         showInHome = false;
    
    if (!file) {
        res.send('no file to upload');
    } else {
        var cover = file.destination.slice(6) + '/' + file.originalname;
        const newProduct = new Product({ title, showInHome, category, available, price, fullPrice, description, cover, lastUpdate: new Date() });
        newProduct.save()
            .then(product => {
                res.redirect(`/product/product-view?productID=${newProduct._id}`);
            }).catch(err => {
                if (err) console.log(err);
            });
    }
});
router.post('/edit-product', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    var { productID, title, category, available, price, fullPrice, description, showInHome } = req.body;
    if(available) available = true;
    else         available = false;
    if(showInHome) showInHome = true;
    else         showInHome = false;
    
    Product.findById(productID, (err, product) => {
        var cover = product.cover;
        if(file) cover = file.destination.slice(6) + '/' + file.originalname;
        Product.updateMany({_id: productID}, {$set: { title, showInHome, category, available, price, fullPrice, description, cover, lastUpdate: new Date() }}, (err, doc) => {
            res.redirect(`/product/product-view?productID=${productID}`);
        });
    });
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
router.post('/set-cover', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    if (!file) res.send('no file to upload');
    else {
        var type = file.mimetype.split('/')[0];
        var link = file.destination.slice(6) + '/' + file.originalname;
        console.log(link);
        Setting.updateMany({}, {$set: {background: {type, link}}}, (err, setting) => {
            if(err) console.log(err);
            fs.unlink('./public/img/header.jpg', (err) => {
                if(err) console.log(err);
                fs.copyFile(path.join(__dirname, '../public') + link, './public/img/header.jpg', (err) => {
                    if (err) throw err;
                    console.log('header changed successfuly');
                });
            });
            res.redirect('/dashboard/home-setting');
        });
    }
});
router.post('/product-file', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const {productID, title} = req.body;
    const file = req.file;
    if (!file) res.send('no file to upload');
    else {
        var type = file.mimetype.split('/')[0];
        var link = file.destination.slice(6) + '/' + file.originalname;
        Product.findById(productID, (err, product) => {
            var files = product.files;
            files.push({link, type, title});
            Product.updateMany({_id: productID}, {$set: {files}}, (err) => {
                if(err) console.log(err);
                res.redirect(`/product/product-view?productID=${productID}`);
            });
        });
    }
});


module.exports = router;