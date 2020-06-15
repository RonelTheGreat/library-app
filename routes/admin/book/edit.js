var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    Book = require('../../../models/book');

// this will render the edit book's page
router.get('/:id/edit_book', function(req, res) {
    // find the specific book to edit
    Book.findById(req.params.id, (err, book) => {
        if (err)
            return console.log('something went wrong finding the book ...');

        // if there are no errors
        // render the edit book's page
        // with all the information of the book
        res.render('admin/book/edit', { book: book });
    });
});

// this will process the editing of the book
router.post('/edit_book', function(req, res) {
    // find the book to edit
    Book.findById(req.body.id, (err, book) => {
        if (err) return console.log('something went wrong updating the book');

        // if there are no errors
        // set the new book's filename
        fs.renameSync(
            `public/images/QRcodes/books/${book.title}_${book.author}_${
                book.edition ? book.edition : ''
            }.png`,
            `public/images/QRcodes/books/${req.body.title.toLowerCase()}_${req.body.author.toLowerCase()}_${
                req.body.edition ? req.body.edition : ''
            }.png`
        );

        // update book information
        req.body.edition && (book.edition = req.body.edition);
        book.title = req.body.title.toLowerCase();
        book.author = req.body.author.toLowerCase();
        book.publisher = req.body.publisher.toLowerCase();
        book.yearPublished = req.body.yearPublished;
        book.validity = req.body.validity;
        book.fine = req.body.fine;
        book.save();

        // if no errors
        // flash a success message
        res.json({ success: true });
    });
});

module.exports = router;
