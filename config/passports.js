const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Load User model
const User = require('../models/User');

module.exports = function(){
    passport.use(
        new LocalStrategy({ usernameField: 'phone' , passwordField: 'phone'}, function(username, password, done){
            //Match User
            User.findOne({phone: username})
                .then(user => {
                    if(user) return done(null, user);
                })
                .catch(err => console.log(err));
        })
    );
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        User.findById(id,function(err, user){
            done(err, user);
        });
    });
    
}
