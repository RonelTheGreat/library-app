var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    Book = require('../../../models/book');

// this will process the deletion of books
router.post('/delete_book', function(req, res) {
    // find the specific book to delete
    Book.findByIdAndRemove(req.body.id, (err, book) => {
        if (err) return res.json({ success: false });

        // if there are no errors
        // set the path for the qr code to delete
        let qrCodeToDelete = `public/images/QRcodes/books/${book.title}_${
            book.author
        }_${book.edition ? book.edition : ''}.png`;

        // remove QR CODE
        fs.unlink(qrCodeToDelete, err => {
            if (err) return console.log('cant delete qr code of the book');

            // if successfully deleted
            // flash message
            res.json({ success: true });
        });
    });
});

module.exports = router;
