var express = require('express'),
    router = express.Router(),
    QRCode = require('qrcode'),
    Book = require('../../../models/book');

// this will render the admin add book's page
router.get('/add_book', (req, res) => {
    // remove unnecessary sessions
    req.session.loginErrors = null;
    req.session.adminRegErrors = null;
    req.session.userRegErrors = null;
    req.session.success = null;
    req.session.username = null;

    // render add book's page
    res.render('admin/book/add', {
        errors: req.session.bookRegErrors,
        inputValues: req.session.inputValues
    });
});

// this will process the adding of new books
router.post('/add_book', (req, res) => {
    // grab all the required information of the book
    var title = req.body.title;
    var author = req.body.author;
    var yearPublished = req.body.yearPublished;
    var publisher = req.body.publisher;
    var validity = req.body.validity;
    var edition = req.body.edition;
    var fine = req.body.fine;

    // check for empty fields
    req.checkBody('title', 'title field is empty').notEmpty();
    req.checkBody('author', 'author field is empty').notEmpty();
    req.checkBody('yearPublished', 'year published field is empty').notEmpty();
    req.checkBody('publisher', 'publisher field is empty').notEmpty();
    req.checkBody('validity', 'validity is empty').notEmpty();
    req.checkBody('fine', 'please specify a fine').notEmpty();

    // this will hold all the errors
    let errors = req.validationErrors();

    // store all the information of the book
    var book = {
        title: title.toLowerCase(),
        author: author.toLowerCase(),
        yearPublished: yearPublished,
        publisher: publisher.toLowerCase(),
        validity: validity,
        edition: edition,
        fine: fine
    };

    // if error occurs
    // flash error messages to admin
    if (errors) {
        res.json({ errors: errors });

        // if no eror occurs
    } else {
        // create the book
        Book.create(book, (err, book) => {
            if (err) return console.log('Error');

            // GENERATE QR Code and save
            QRCode.toFile(
                `public/images/QRcodes/books/${title.toLowerCase()}_${author.toLowerCase()}_${
                    edition ? edition : ''
                }.png`,
                `${book._id}`,
                {
                    color: {
                        dark: '#000', // black dots
                        light: '#fff' // white background background
                    }
                },
                function(err) {
                    if (err) throw err;
                }
            );

            // if successfully generated QR code
            // flash a message
            res.json({ success: true });
        });
    }
});

module.exports = router;
