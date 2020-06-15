var express = require('express'),
    router = express.Router(),
    User = require('../../../models/user');

// this will show all the registerd users page
router.get('/show/users', function(req, res) {
    // remove unnecessary sessions
    req.session.loginErrors = null;
    req.session.success = null;
    req.session.regErrors = null;
    req.session.username = null;
    req.session.inputValues = null;

    // if not an admin, redirect to login page
    if (!req.session.isValidated) return res.redirect('/admin/login');

    // grab all the users from DB
    // sort from A-Z
    User.find({ isAdmin: false }, '_id fname mi lname contact fine avatar')
        .sort([['fname', 'ascending']])
        .populate('borrowedBooks')
        .exec((err, users) => {
            if (err) return res.redirect('/admin/show/all');

            // if no error occurs
            // show all users
            res.render('admin/user/users', { users: users });
        });
});

module.exports = router;
