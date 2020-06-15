var express = require('express'),
    router = express.Router(),
    Book = require('../../models/book'),
    Log = require('../../models/log'),
    User = require('../../models/user');

// this will render the retrieval's page
router.get('/:id/return', function(req, res) {
    // grab the user id
    var user_id = req.params.id;
    // remove unnecessary session
    req.session.userloginError = null;

    // find the user
    // show all the borrowed books of the user
    User.findById(user_id)
        .populate('borrowedBooks')
        .exec((err, user) => {
            if (err) return res.redirect(`/user/${user._id}/home`);

            res.render('user/return', { user: user, msg: req.session.msg });
        });
});

// this will process the returning of books
router.post('/:id/return', function(req, res) {
    // grab user id and book id
    var book_id = req.body.id;
    var user_id = req.params.id;

    // find the specific book to return
    Book.findById(book_id, (err, book) => {
        if (err) return res.redirect(`/user/${user_id}/return`);

        // if no such book
        // flash an error message
        if (book === null) {
            req.session.msg = { success: false };
            return res.redirect(`/user/${user_id}/return`);
        }

        // if no error occurs, find the specific user
        // that is returning the book
        User.findById(
            user_id,
            'fname mi lname fine borrowedBooks',
            (err, user) => {
                if (err) return res.redirect(`/user/${user_id}/return`);

                // check if book is borrowed
                for (var i = 0; i < user.borrowedBooks.length; i++) {
                    // if the book scanned matches one
                    // of the books borrowed
                    if (user.borrowedBooks[i] == book_id) {
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

                        // set dates for calculation
                        let date = new Date();
                        let dateReturned = `${
                            months[date.getMonth()]
                        } ${date.getDate()}, ${date.getFullYear()}`;

                        let dueDate = Math.floor(
                            new Date(book.dueDate) / 1000 / 60 / 60 / 24
                        );
                        let dateNow = Math.floor(
                            new Date(dateReturned) / 1000 / 60 / 60 / 24
                        );

                        // calculate date passed since due date
                        let datePassed = dateNow - dueDate;

                        // create log
                        Log.create({
                            logName: 'returned',
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
                                dateReturned: dateReturned,
                                dueDate: book.dueDate
                            },
                            fine:
                                datePassed > 0 &&
                                Number(datePassed) * Number(book.fine)
                        });

                        // remove the specific book
                        // to the borrowed books of the user
                        user.borrowedBooks = removeItem(
                            user.borrowedBooks,
                            book_id
                        );

                        // if the book is overdue
                        // record the fine of the user
                        datePassed > 0 &&
                            (user.fine +=
                                Number(datePassed) * Number(book.fine));
                        book.isBorrowed = false;
                        book.dueDate = '';
                        book.dateBorrowed = '';
                        book.notif = {};
                        user.save();
                        book.save();

                        // flash a success message to the user
                        req.session.msg = { success: true };
                        return res.redirect(`/user/${user_id}/return`);
                    }
                }

                req.session.msg = { success: false };
                res.redirect(`/user/${user_id}/return`);
            }
        );
    });
});

// array item remover
function removeItem(arr, value) {
    return arr.filter(function(item) {
        return item != value;
    });
}

module.exports = router;
