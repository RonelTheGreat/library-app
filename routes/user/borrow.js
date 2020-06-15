var express = require('express'),
    router = express.Router(),
    Book = require('../../models/book'),
    User = require('../../models/user'),
    Log = require('../../models/log');

// this will render the borrower's page
router.get('/:id/borrow', function(req, res) {
    var user_id = req.params.id;

    req.session.userloginError = null;

    // show all the borrowed books of the user
    User.findById(user_id)
        .populate('borrowedBooks')
        .exec((err, user) => {
            if (err) return res.redirect(`/user/${user._id}/home`);

            // render the borrower's page
            res.render('user/borrow', { user: user, msg: req.session.msg });
        });
});

// this will process the borrowing of books
router.post('/:id/borrow', function(req, res) {
    // grab user id and book id
    var book_id = req.body.id;
    var user_id = req.params.id;

    // find the book to borrow
    Book.findById(book_id, (err, book) => {
        if (err) return res.redirect(`/user/${user_id}/borrow`);

        // check if book is existing
        if (book === null) {
            req.session.msg = { success: false };
            return res.redirect(`/user/${user_id}/borrow`);
        }

        // check if the book is already been borrowed
        // if the book is borrowed by another, flash a message that it is unavailable
        //else, if the book is borrowed with the current user, flash a message that the book is already scanned
        if (book.isBorrowed === true) {
            if (book.borrower == user_id) {
                req.session.msg = 'duplicate';
                return res.redirect(`/user/${user_id}/borrow`);
            } else {
                req.session.msg = 'borrowed';
                return res.redirect(`/user/${user_id}/borrow`);
            }
        }

        // if no errors, flash a success msg
        req.session.msg = { success: true };

        // find the user and save the transaction
        User.findById(user_id, 'fname mi lname borrowedBooks', (err, user) => {
            if (err) return res.redirect(`/user/${user_id}/borrow`);

            let date = new Date();
            let months = [
                'Jan.',
                'Feb.',
                'March',
                'April',
                'May',
                'June',
                'July',
                'Aug.',
                'Sept.',
                'Oct.',
                'Nov.',
                'Dec.'
            ];

            book.isBorrowed = true;

            // set the date borrowed
            book.dateBorrowed = `${
                months[date.getMonth()]
            } ${date.getDate()}, ${date.getFullYear()}`;
            book.borrower = user._id;

            // get the current date to make it a reference date
            var refDate = new Date(book.dateBorrowed);

            // set a new date adding the validity
            var newDate = refDate.setDate(refDate.getDate() + book.validity);
            // create the calculated due date
            var dueDate = new Date(newDate);

            // save the book's due date
            book.dueDate = `${
                months[dueDate.getMonth()]
            } ${dueDate.getDate()}, ${dueDate.getFullYear()}`;

            // create log
            Log.create({
                logName: 'borrowed',
                borrower: `${user.fname} ${user.mi}. ${user.lname}`,
                book: {
                    title: book.title,
                    author: book.author,
                    edition: book.edition,
                    yearPublished: book.yearPublished,
                    publisher: book.publisher,
                    validity: book.validity
                },
                date: {
                    dateBorrowed: book.dateBorrowed,
                    dueDate: book.dueDate
                }
            });

            // save to DB if not a duplicate
            user.borrowedBooks.push(book_id);
            user.save();
            book.save();
            res.redirect(`/user/${user_id}/borrow`);
        });
    });
});

module.exports = router;
