var express = require('express'),
    router = express.Router(),
    bcrypt = require('bcrypt'),
    User = require('../../models/user');

// adding new admin
// this will render the right page
// for creating a new admin
router.get('/add_admin', (req, res) => {
    // empty any unnecessary sessions
    req.session.loginErrors = null;
    req.session.bookRegErrors = null;
    req.session.userRegErrors = null;
    req.session.success = null;
    req.session.username = null;

    // if not an admin
    // redirect to login page
    if (!req.session.isValidated) return res.redirect('/admin/login');

    // if an admin
    // render adding admin's page
    res.render('admin/add');
});

// this will process the new request
// for adding a new admin
router.post('/add_admin', (req, res) => {
    // grab the username, password and confirmed password
    let username = req.body.username;
    let password = req.body.password;
    let cpassword = req.body.cpassword;

    // check for empty field
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('cpassword', 're-type password').notEmpty();

    // set a variable for holding all the errors
    let errors = req.validationErrors();
    // this will hold the previous values
    // typed by the admin
    req.session.inputValues = {
        username: username,
        password: password
    };

    // if there are errors
    // such as empty fields
    // flash a message to the admin
    if (errors) {
        res.json({ errors: errors });

        // if passwords dont match
        // flash a message to the admin
    } else if (password != cpassword) {
        res.json({ errors: [{ msg: "passwords don't match!" }] });

        // if no error occurs
    } else {
        // hash the password first for security
        bcrypt.hash(password, 10, (err, hashedPW) => {
            // store the credentials of the
            // new admin being created
            let newAdmin = {
                username: username,
                password: hashedPW,
                isAdmin: true
            };

            if (err) return console.log('Error hashing the password');

            // if password hashing is successful
            // create new admin and flash a message
            User.create(newAdmin, (err, newAdmin) => {
                if (err)
                    return console.log('Error in creating a new admin ...');

                res.json({ success: true });
            });
        });
    }
});

module.exports = router;
