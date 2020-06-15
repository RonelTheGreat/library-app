var express = require('express'),
    router = express.Router(),
    Book = require('../../../models/book');

// show all borrowed books
router.get('/show/borrowed', function(req, res) {
    // remove unnecessary sessions
    req.session.loginErrors = null;
    req.session.success = null;
    req.session.regErrors = null;
    req.session.username = null;
    req.session.inputValues = null;

    // if not an admin, redirect to login page
    if (!req.session.isValidated) return res.redirect('/admin/login');

    // find all the borrowed books
    // sort from A-Z
    Book.find({ isBorrowed: true })
        .sort([['title', 'ascending']])
        .populate('borrower')
        .exec((err, books) => {
            if (err) return res.redirect('/admin/show/all');

            // if there are no errors
            // show all the borrowed books
            res.render('admin/book/borrowed', { books: books });
        });
});

module.exports = router;
