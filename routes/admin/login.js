var express = require('express'),
    router = express.Router(),
    bcrypt = require('bcrypt'),
    User = require('../../models/user');

// this will render the login page for the admin
router.get('/login', function(req, res) {
    // empty any unnecessary sessions
    req.session.regErrors = null;
    req.session.success = null;
    req.session.userloginError = null;

    // render login page
    res.render('admin/login', {
        errors: req.session.loginErrors,
        inputValues: req.session.inputValues
    });
});

// this will process the credentials
// when an admin tries to login
router.post('/login', function(req, res) {
    // store username and password
    let username = req.body.username;
    let password = req.body.password;

    // check for empty fields
    req.checkBody('username', 'enter your username').notEmpty();
    req.checkBody('password', 'enter your password').notEmpty();

    // set a holder for errors
    let errors = req.validationErrors();

    // this will hold previous values
    // of the input
    req.session.inputValues = [
        {
            username: username
        }
    ];

    // if an error occur
    // redirect to login page
    // flash the error
    if (errors) {
        req.session.loginErrors = errors;
        res.redirect('/admin/login');
        return;
    }

    // if username and password are not empty
    if (username && password != '') {
        // find admin with the username
        User.findOne({ username: username }).then(admin => {
            // if no such admin
            if (!admin) {
                // redirect to login page and flash an error msg
                req.session.loginErrors = [{ msg: 'no such user' }];
                req.session.isValidated = false;
                res.redirect('/admin/login');
                // if username is valid
            } else {
                //compare the password with the hashed password on DB
                bcrypt.compare(password, admin.password, (err, result) => {
                    // if password match
                    // then redirect to admin's home page
                    if (result) {
                        req.session.isValidated = true;
                        req.session.username = admin.username;
                        res.redirect('/admin/show/all');
                        // if comparing fails,
                        // redirect to login page
                    } else {
                        req.session.loginErrors = [{ msg: 'no such user' }];
                        req.session.isValidated = false;
                        res.redirect('/admin/login');
                    }
                });
            }
        });
    }
});

module.exports = router;
