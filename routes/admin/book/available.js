var express = require('express'),
    router = express.Router(),
    Book = require('../../../models/book');

// this will show all available books
router.get('/show/available', function(req, res) {
    // remove unnecessary sessions
    req.session.loginErrors = null;
    req.session.success = null;
    req.session.regErrors = null;
    req.session.username = null;
    req.session.inputValues = null;

    // if not an admin, redirect to login page
    if (!req.session.isValidated) return res.redirect('/admin/login');

    // find all the books that are not borrowed
    // sort from A-Z
    Book.find({ isBorrowed: false })
        .sort([['title', 'ascending']])
        .exec((err, books) => {
            if (err) return res.redirect('/admin/show/all');

            // if no error occurs
            // show all the available books
            res.render('admin/book/available', { books: books });
        });
});

module.exports = router;
