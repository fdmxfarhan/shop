var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Course = require('../models/Course');
const mail = require('../config/mail');
const dateConvert = require('../config/dateConvert');
const { session } = require('passport');

router.get('/', (req, res) => {
    Course.find({}, (err, courses) => {
        res.render('./course/course-list',{
            user: req.user,
            courses,
        });
    })
});
router.get('/course-view', (req, res) => {
    var {courseID} = req.query;
    var sessionNum = 0;
    if(req.query.sessionNum) sessionNum = req.query.sessionNum;
    Course.findById(courseID, (err, course) => {
        course.seen += 1;
        Course.updateMany({_id: courseID}, {$set: {seen: course.seen}}, (err, doc) => {
            if(err) console.log(err);
        })
        res.render('./course/course-view',{
            user: req.user,
            course,
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
router.post('/add-comment', ensureAuthenticated, (req, res, next) => {
    var {courseID, text} = req.body;
    Course.findById(courseID, (err, course) => {
        var comments = course.comments;
        comments.push({
            text,
            fullname: req.user.fullname,
            userID: req.user._id,
            date: new Date(),
        });
        Course.updateMany({_id: courseID}, {$set: {comments}}, (err) => {
            if(err) throw err;
            res.redirect(`/course/course-view?courseID=${courseID}`)
        })
    });
});
router.get('/delete-comment', ensureAuthenticated, (req, res, next) => {
    var {courseID, index} = req.query;
    if(req.user.role == 'admin'){
        Course.findById(courseID, (err, course) => {
            var comments = course.comments;
            comments.splice(index, 1);
            Course.updateMany({_id: courseID}, {$set: {comments}}, (err) => {
                if(err) throw err;
                res.redirect(`/course/course-view?courseID=${courseID}`)
            })
        });
    }
})
router.get('/delete-course', ensureAuthenticated, (req, res, next) => {
    var {courseID} = req.query;
    Course.deleteMany({_id: courseID}, (err) => {
        res.redirect('/dashboard');
    })
});
router.get('/add-to-cart', ensureAuthenticated, (req, res, next) => {
    var { courseID } = req.query;
    var cart = req.user.cart;
    if(cart.map(e => e.id.toString()).indexOf(courseID) == -1)
        cart.push({type: 'course', id: courseID});
    User.updateMany({_id: req.user._id}, {$set: {cart}}, (err, doc) => {
        res.redirect('/dashboard/cart');
    });
});



module.exports = router;
