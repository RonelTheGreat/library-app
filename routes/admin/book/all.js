var express = require('express'),
    router = express.Router(),
    Book = require('../../../models/book');

// this will show all the books
router.get('/show/all', function(req, res) {
    // remove unnecessary sessions
    req.session.loginErrors = null;
    req.session.success = null;
    req.session.regErrors = null;
    req.session.inputValues = null;

    // if not an admin, redirect to login page
    if (!req.session.isValidated) return res.redirect('/admin/login');

    // find all the books
    // sort from A-Z
    Book.find({})
        .sort([['title', 'ascending']])
        .exec((err, books) => {
            if (err) return res.redirect('/');

            // if there are no errors
            // render or show all the books
            res.render('admin/book/all', {
                books: books,
                username: req.session.username
            });
        });
});

module.exports = router;
