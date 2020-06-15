// SERIAL COMMUNICATION FROM NODE TO ARDUINO
const SerialPort = require('serialport'),
    checkBookState = require('./check-book-state'),
    formatData = require('./format-data'),
    Readline = require('@serialport/parser-readline'),
    Book = require('../models/book'),
    port = new SerialPort('COM4', { baudRate: 9600 }),
    parser = port.pipe(new Readline({ delimiter: '\n' }));

// a holder for all the borrowed books
// to be notified
let bookList = [];
let timer;

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

// if port is not found flash an error message
port.on('error', err => console.log(err.message));

// if port is CLOSED, flash a message
port.on('close', () => console.log('PORT IS CLOSED ...'));

// if port is OPEN
port.on('open', () => {
    // flash a message that port is open
    console.log('PORT IS OPEN');

    // set a timer to check for borrowed books
    // every 5 seconds
    timer = setTimeout(function check() {
        // find books that is borrowed
        Book.find({ isBorrowed: true })
            .populate('borrower')
            .exec((err, books) => {
                err && console.log(`ERROR FINDING BORROWED BOOKS: ${err}`);

                // if there are borrowed books
                if (books.length > 0) {
                    // filter borrowed books
                    // return only the books that is
                    // current, due tomorrow, due today or overdue
                    bookList = books
                        .filter(book => {
                            let data = checkBookState(book);
                            let state = data.split('#')[0];
                            if (state !== '<notified' && state !== '<notDue') {
                                return book;
                            }
                        })
                        // prepare the data before sending
                        // to arduino
                        .map(book => {
                            return checkBookState(book);
                        });
                }

                // if querying is done
                // check if there are books to be notified
                // if there is/are
                if (!bookList.length <= 0) {
                    // flash the date and number of books to be notified
                    // [L:] is for the number of books to be notified
                    // [D:] is for the current date, excluding month and year
                    console.log(
                        `[L:${bookList.length}]  [D:${new Date().getDate()}]`
                    );

                    // wait for 1 sec before sending a data to arduino
                    setTimeout(() => {
                        // 1 sec have passed
                        // send the formatted data to arduino
                        // i.e. <state#contact#title#author#borrowed#due#fine>
                        serial.send(formatData(bookList[0]));
                    }, 1000);

                    // if there are no borrowed books
                } else {
                    // flash the date and number of books to be notified
                    // [L:] is for the number of books to be notified
                    // [D:] is for the current date, excluding month and year
                    console.log(
                        `[L:${bookList.length}]  [D:${new Date().getDate()}]`
                    );
                    // run the checking again every 5 sec
                    timer = setTimeout(check, 5000);
                }
            });
    }, 5000);
});

// if there is data coming from arduino
parser.on('data', data => {
    // split the data into segments
    // for manipulation
    let dataFromArd = data.split('#');

    // check if data from arduino has the feedback msg
    // i.e. success or failed
    if (dataFromArd.includes('failed') || dataFromArd.includes('success')) {
        let msg = dataFromArd;

        // grab feedback message
        // either success or failed
        let feedbackMsg = msg[1];
        // grab the title of the book
        // received from arduino
        let bookTitle = msg[2];

        // if the message is sent to the borrower
        if (feedbackMsg === 'success') {
            // mark the book that it is notified
            // with the date today
            Book.findOne({ title: bookTitle.toLowerCase() }, (err, book) => {
                if (err) return console.log(err);

                // get the date today
                let date = new Date();
                // format day
                let dateNotified = `${
                    months[date.getMonth()]
                } ${date.getDate()}, ${date.getFullYear()}`;
                // save
                book.notif.dateNotified = dateNotified;
                book.notif.isNotified = true;
                book.save();
                console.log(`<--- ${bookTitle} @notified`);
            });

            // if done marking the book that it is notified
            // filter out the notified book from the list
            // of books to be notified
            bookList = bookList.filter(book => {
                let title = book.split('#')[2];
                return title != bookTitle.toLowerCase();
            });

            // if there are remaining books to notify
            if (bookList.length > 0) {
                // wait for 1 sec before sending a data to arduino
                setTimeout(() => {
                    // send the formatted data to arduino
                    // i.e. <state#contact#title#author#borrowed#due#fine>
                    serial.send(formatData(bookList[0]));
                }, 1000);

                // if there are no borrowed books to notify
            } else {
                // set a timer AGAIN to check for
                // borrowed books every 5 seconds
                timer = setTimeout(function check() {
                    // find books that is borrowed
                    Book.find({ isBorrowed: true })
                        .populate('borrower')
                        .exec((err, books) => {
                            err &&
                                console.log(
                                    `ERROR FINDING BORROWED BOOKS: ${err}`
                                );

                            // if there are borrowed books
                            if (books.length > 0) {
                                // filter borrowed books
                                // return only the books that is
                                // current, due tomorrow, due today or overdue
                                bookList = books
                                    .filter(book => {
                                        let data = checkBookState(book);
                                        let state = data.split('#')[0];
                                        if (
                                            state !== '<notified' &&
                                            state !== '<notDue'
                                        ) {
                                            return book;
                                        }
                                    })
                                    // prepare the data before sending
                                    // to arduino
                                    .map(book => {
                                        return checkBookState(book);
                                    });
                            }

                            // if querying is done
                            // check if there are books to be notified
                            // if there is/are
                            if (!bookList.length <= 0) {
                                // flash the date and number of books to be notified
                                // [L:] is for the number of books to be notified
                                // [D:] is for the current date, excluding month and year
                                console.log(
                                    `[L:${
                                        bookList.length
                                    }]  [D:${new Date().getDate()}]`
                                );

                                // wait for 1 sec before sending a data to arduino
                                setTimeout(() => {
                                    // 1 sec have passed
                                    // send the formatted data to arduino
                                    // i.e. <state#contact#title#author#borrowed#due#fine>
                                    serial.send(formatData(bookList[0]));
                                }, 1000);

                                // if there are no borrowed books
                            } else {
                                // flash the date and number of books to be notified
                                // [L:] is for the number of books to be notified
                                // [D:] is for the current date, excluding month and year
                                console.log(
                                    `[L:${
                                        bookList.length
                                    }]  [D:${new Date().getDate()}]`
                                );
                                // run the checking again every 5 sec
                                timer = setTimeout(check, 5000);
                            }
                        });
                }, 5000);
            }
        } else {
            // if message is not sent
            // try to send again
            console.log(`<--- ${bookTitle} @failed`);
            serial.send(bookList[0]);
        }
    }
});

// serial data sender
let serial = {
    /**
     * send data to arduino
     * @param {String} message a formatted message
     * i.e. <state#contact#title#author#dateBorrowed#due#fine>
     */
    send: function(message) {
        // grab the tite and state of the book
        let bookTitle = message.split('#')[2];
        let state = message.split('#')[0];
        // send data to arduino
        port.write(message, err => {
            if (err) return console.log(err.message);
            // flash a message to console
            // including the title of the book
            // and state of the book for clarity
            console.log(`---> ${bookTitle} <${state}`);
        });
    }
};
