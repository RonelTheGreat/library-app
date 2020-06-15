var express = require('express'),
    User = require('../../models/user'),
    router = express.Router();

// show all admins on the admins page
router.get('/show/admins', function(req, res) {
    // empty any unnecessary sessions
    req.session.loginErrors = null;
    req.session.success = null;
    req.session.regErrors = null;
    req.session.inputValues = null;

    // if not an admin, redirect to login page
    if (!req.session.isValidated) return res.redirect('/admin/login');

    User.find({ isAdmin: true }, (err, admins) => {
        if (err) return console.log('Something went wrong fetching admins ..');

        // if an admin, view all the admins
        res.render('admin/admins', { admins: admins });
    });
});

module.exports = router;
