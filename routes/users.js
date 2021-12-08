var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
const bcrypt = require('bcryptjs');
const mail = require('../config/mail');
const sms = require('../config/sms');
const generateCode = require('../config/generateCode');
const passport = require('passport');

router.get('/register', (req, res, next) => {
    if(req.user)
        res.redirect('/dashboard');
    else
        res.render('register');
});

router.get('/login', (req, res, next) => {
    if(req.user)
        res.redirect('/dashboard');
    else
        res.render('login');
});
  
router.post('/register', (req, res, next) => {
    const { firstName, lastName, address, phone, school, idNumber, password, configpassword } = req.body;
    const role = 'user', card = 0;
    const ipAddress = req.connection.remoteAddress;
    let errors = [];
    /// check required
    if(!firstName || !lastName || !address || !phone || !school || !idNumber || !password || !configpassword){
        errors.push({msg: 'لطفا موارد خواسته شده را کامل کنید!'});
    }
    /// check password match
    if(password !== configpassword){
        errors.push({msg: 'تایید رمز عبور صحیح نمیباشد!'});
    }
    /// check password length
    if(password.length < 4){
        errors.push({msg: 'رمز عبور شما بسیار ضعیف میباشد!'});
    }
    ///////////send evreything 
    if(errors.length > 0 ){
        res.render('register', { firstName, lastName, address, phone, school, idNumber, errors});
    }
    else{
        const fullname = firstName + ' ' + lastName;
        // validation passed
        User.findOne({ idNumber: idNumber})
            .then(user =>{
            if(user){
                // user exist
                errors.push({msg: 'کد ملی قبلا ثبت شده است.'});
                res.render('register', { firstName, lastName, address, phone, school, idNumber, errors });
            }
            else {
                const newUser = new User({ipAddress, fullname, firstName, lastName, address, phone, school, idNumber, password, role, card});
                // Hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'ثبت نام با موفقیت انجام شد. اکنون میتوانید وارد شوید.');
                        res.redirect('/users/login');
                         
                    }).catch(err => console.log(err));
                }));
                console.log(newUser);
            }
        });
    }  
});
  
router.post('/login', function(req, res, next){
    const {phone} = req.body;
    let errors = [];
    /// check required
    if(phone.length != 11 ){
        errors.push({msg: 'شماره تلفن صحیح نمی‌باشد'});
    }
    if(errors.length > 0){
      res.render('login', { phone, errors});
    }
    else{
        var code = generateCode(4);
        sms(phone, `رمز یک بار مصرف شما: ${code}`);
        console.log(code);
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(code, salt, (err, hash) => {
            if(err) throw err;
            res.render('enter-code', {
                code: hash,
                phone: phone,
            });
        }));
    }
});
  
router.post('/enter-code', function(req, res, next){
    const {phone, code, enterCode} = req.body;
    bcrypt.compare(code, enterCode, function(err, isMatch){
        if(err) throw err;
        else{
            User.findOne({phone: phone}, (err, user) => {
                if(user){
                    passport.authenticate('local', {
                        successRedirect: '/dashboard?login=true',
                        failureRedirect: '/users/login',
                        failureFlash: true
                    })(req, res, next);
                }
                else{
                    const newUser = new User({phone, role: 'admin'});
                    newUser.save().then(() => {
                        passport.authenticate('local', {
                            successRedirect: '/dashboard?login=true',
                            failureRedirect: '/users/login',
                            failureFlash: true
                        })(req, res, next);
                    }).catch(err => {
                        if(err) throw err;
                    });
                }
            });
        }
    });
});

// Logout handle
router.get('/logout', function(req, res, next){
    req.logOut();
    req.flash('success_msg', 'شما با موفقیت خارج شدید');
    res.redirect('/users/login');
});

module.exports = router;
