var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Course = require('../models/Course');
var Product = require('../models/Product');
const mail = require('../config/mail');
const dateConvert = require('../config/dateConvert');
const { session } = require('passport');

router.get('/', (req, res) => {
    Product.find({}, (err, products) => {
        res.render('./product/product-list',{
            user: req.user,
            products,
        });
    })
});
router.get('/product-view', (req, res) => {
    var {productID} = req.query;
    var sessionNum = 0;
    if(req.query.sessionNum) sessionNum = req.query.sessionNum;
    Product.findById(productID, (err, product) => {
        res.render('./product/product-view',{
            user: req.user,
            product,
            dateConvert,
            sessionNum,
        });
    });
});
router.get('/delete-session', ensureAuthenticated, (req, res) => {
    if(req.user.role == 'admin'){
        var {courseID, sessionNum} = req.query;
        Course.findById(courseID, (err, course) => {
            sessions = course.sessions;
            sessions.splice(sessionNum, 1);
            Course.updateMany({_id: courseID}, {$set: {sessions}}, (err) => {
                res.redirect(`/course/course-view?courseID=${courseID}`)
            })
        });
    }
});
router.post('/add-property', ensureAuthenticated, (req, res) => {
    var {productID, title, value} = req.body;
    Product.findById(productID, (err, product) => {
        properties = product.properties;
        properties.push({title, value});
        Product.updateMany({_id: productID}, {$set: {properties}}, (err) => {
            res.redirect(`/product/product-view?productID=${productID}`)
        })
    });
});
router.get('/delete-property', ensureAuthenticated, (req, res) => {
    var {productID, propertyNum} = req.query;
    Product.findById(productID, (err, product) => {
        properties = product.properties;
        properties.splice(propertyNum, 1);
        Product.updateMany({_id: productID}, {$set: {properties}}, (err) => {
            res.redirect(`/product/product-view?productID=${productID}`)
        })
    });
});
router.post('/add-comment', ensureAuthenticated, (req, res, next) => {
    var {productID, text} = req.body;
    Product.findById(productID, (err, product) => {
        var comments = product.comments;
        comments.push({
            text,
            fullname: req.user.fullname,
            userID: req.user._id,
            date: new Date(),
        });
        Product.updateMany({_id: productID}, {$set: {comments}}, (err) => {
            if(err) throw err;
            res.redirect(`/product/product-view?productID=${productID}`)
        })
    });
});
router.get('/delete-comment', ensureAuthenticated, (req, res, next) => {
    var {productID, index} = req.query;
    if(req.user.role == 'admin'){
        Product.findById(productID, (err, product) => {
            var comments = product.comments;
            comments.splice(index, 1);
            Product.updateMany({_id: productID}, {$set: {comments}}, (err) => {
                if(err) throw err;
                res.redirect(`/product/product-view?productID=${productID}`)
            })
        });
    }
})
router.get('/delete-product', ensureAuthenticated, (req, res, next) => {
    var {productID} = req.query;
    Product.deleteMany({_id: productID}, (err) => {
        res.redirect('/dashboard');
    })
});
router.get('/add-to-cart', ensureAuthenticated, (req, res, next) => {
    var { productID } = req.query;
    var cart = req.user.cart;
    if(cart.map(e => e.id.toString()).indexOf(productID) == -1)
        cart.push({type: 'product', id: productID});
    User.updateMany({_id: req.user._id}, {$set: {cart}}, (err, doc) => {
        res.redirect('/dashboard/cart');
    });
});

module.exports = router;
