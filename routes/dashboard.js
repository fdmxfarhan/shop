var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Course = require('../models/Course');
var Product = require('../models/Product');
var Setting = require('../models/Setting');
const mail = require('../config/mail');
const dateConvert = require('../config/dateConvert');
const generateCode = require('../config/generateCode');


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
            Product.find({}, (err, products) => {
                User.find({}, (err, users) => {
                    res.render('./dashboard/admin-dashboard', {
                        user: req.user,
                        login: req.query.login,
                        courses,
                        products,
                        users
                    });
                });
            });
        })
    }
});
router.get('/clear-cart', ensureAuthenticated, (req, res, next) => {
    User.updateMany({_id: req.user._id}, {$set: {cart: []}}, (err, doc) => res.send('done'));
});
router.post('/complete-info', ensureAuthenticated, (req, res, next) => {
    var {firstName, lastName, idNumber, email, address, password, password2} = req.body;
    var fullname = firstName + ' ' + lastName;
    errors = [];
    if(password != password2) errors.push({msg: 'تایید رمز عبور صحیح نمی‌باشد'});
    if(password.length < 4) errors.push({msg: 'رمز عبور بسیار ضعیف می‌باشد'});
    if(errors.length > 0){
        res.render('./dashboard/user-dashboard', {
            user: req.user,
            firstName, 
            lastName, 
            idNumber, 
            email, 
            address, 
            password, 
            password2,
            errors,
        });
    }
    else{
        User.updateMany({_id: req.user._id}, {$set: {firstName, lastName, idNumber, email, address, fullname, completed: true, password}}, (err) => {
            res.redirect('/dashboard')
        });
    }
});
router.post('/password-change', ensureAuthenticated, (req, res, next) => {
    var {password, password2} = req.body;
    errors = [];
    if(password != password2) errors.push({msg: 'تایید رمز عبور صحیح نمی‌باشد'});
    if(password.length < 4) errors.push({msg: 'رمز عبور بسیار ضعیف می‌باشد'});
    if(errors.length > 0){
        res.render('./dashboard/user-setting', {
            user: req.user,
            password, 
            password2,
            errors,
        });
    }
    else{
        User.updateMany({_id: req.user._id}, {$set: {password}}, (err) => {
            res.redirect('/dashboard');
        });
    }
});
router.get('/home-setting', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        Setting.findOne({}, (err, setting) => {
            res.render('home-setting',{
                user: req.user,
                setting,
            });
        });
    }
    else res.send('Access Denied!!')
});
router.get('/cart', ensureAuthenticated, (req, res, next) => {
    var cart = req.user.cart;
    Course.find({}, (err, courses) => {
        Product.find({}, (err, products) => {
            var sum = 0;
            for(var i=0; i<cart.length; i++){
                if(cart[i].type == 'course'){
                    for(var j=0; j<courses.length; j++){
                        if(cart[i].id.toString() == courses[j]._id.toString()){
                            cart[i].course = courses[j];
                            sum += cart[i].course.price;
                        }
                    }
                }
                else if(cart[i].type == 'product'){
                    for(var j=0; j<products.length; j++){
                        if(cart[i].id.toString() == products[j]._id.toString()){
                            cart[i].product = products[j];
                            sum += cart[i].product.price;
                        }
                    }
                }
            }
            res.render('./dashboard/user-cart', {
                user: req.user,
                cart,
                dateConvert,
                sum,
            })
        })
    })
});
router.get('/remove-from-cart', ensureAuthenticated, (req, res, next) => {
    var cart = req.user.cart;
    var {courseID} = req.query;
    for(var i=0; i<cart.length; i++){
        if(cart[i].id.toString() == courseID){
            cart.splice(i, 1);
            i--;
        }
    }
    User.updateMany({_id: req.user._id}, {$set: {cart}}, (err, doc) => {
        res.redirect('/dashboard/cart');
    });
});
router.get('/users', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        User.find({}, (err, users) => {
            res.render('./dashboard/admin-users', {
                user: req.user,
                users,
                
            })
        })
    }
});
router.get('/make-user', ensureAuthenticated, (req, res, next) => {
    var {userID} = req.query;
    User.updateMany({_id: userID}, {$set: {role: 'user'}}, (err, doc) => {
        res.redirect('/dashboard/users');
    })
});
router.get('/make-admin', ensureAuthenticated, (req, res, next) => {
    var {userID} = req.query;
    User.updateMany({_id: userID}, {$set: {role: 'admin'}}, (err, doc) => {
        res.redirect('/dashboard/users');
    })
});
router.get('/delete-user', ensureAuthenticated, (req, res, next) => {
    var {userID} = req.query;
    User.deleteMany({_id: userID}, (err, doc) => {
        res.redirect('/dashboard/users');
    })
});
router.get('/setting', ensureAuthenticated, (req, res, next) => {
    res.render('./dashboard/user-setting', {
        user: req.user,
        editing: true,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        idNumber: req.user.idNumber,
        email: req.user.email,
        address: req.user.address,
    })
});
router.get('/delete-product-file', ensureAuthenticated, (req, res, next) => {
    var {productID, index} = req.query;
    Product.findById(productID, (err, product) => {
        var files = product.files;
        files.splice(index, 1);
        Product.updateMany({_id: productID}, {$set: {files}}, (err) => {
            if(err) console.log(err);
            res.redirect(`/product/product-view?productID=${productID}`);
        });
    });
})


module.exports = router;


