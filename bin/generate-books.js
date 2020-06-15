var Book = require('../models/book'),
    QRCode = require('qrcode');

var books = [
    {
        title: 'Digital Fundamentals',
        author: 'Thomas L. Floyd',
        publisher: 'Pearson Education International',
        yearPublished: 2006,
        validity: 1,
        edition: 9,
    },

    {
        title: 'Electronic Devices',
        author: 'Thomas L. Floyd',
        publisher: 'Pearson Education International',
        yearPublished: 2005,
        validity: 1,
        edition: 7,
    },

    {
        title: 'Electrical and Electronic Principles and Technology',
        author: 'John Bird',
        publisher: 'Newnes',
        yearPublished: 2007,
        validity: 1,
        edition: 3,
    },

    {
        title: 'Introduction to Power Electronics',
        author: 'Denis Fewson',
        publisher: 'Nicki Dennis',
        yearPublished: 1998,
        validity: 1,
        edition: 3,
    },

    {
        title: 'Semiconductor Physics and Devices',
        author: 'Donald A. Neamen',
        publisher: 'McGraw-Hill',
        yearPublished: 2013,
        validity: 1,
    },

    {
        title: 'Fundamentals of Electric Circuits',
        author: 'Charles K. Alexander and Matthew N.0. Sadiku',
        publisher: 'McGraw-Hill',
        yearPublished: 2013,
        validity: 1,
    },

    {
        title: 'Fundamentals of Telecommunications',
        author: 'Roger L. Freeman',
        publisher: 'John Wiley & Sons, Inc.',
        yearPublished: 1999,
        validity: 1,
    },

    {
        title: 'Radio System Design for Telecommunications',
        author: 'Roger L. Freeman',
        publisher: 'John Wiley & Sons, Inc',
        yearPublished: 2007,
        validity: 1,
        edition: 3,
    },

    {
        title: 'Principles of Electronic Communications',
        author: 'Louis E. Frenzel Jr.',
        publisher: 'McGraw-Hill',
        yearPublished: 2016,
        validity: 1,
        edition: 4,
    },

    {
        title: 'Advanced Electronic Communications Systems',
        author: 'Wayne Tomasi',
        publisher: 'Pearson Education Limited',
        yearPublished: 2014,
        validity: 1,
        edition: 6,
    },
];

let genBooks = () => {
    books.forEach(book => {
        Book.create(book, (err, book) => {
            if (err) return console.log(err);

            QRCode.toFile(
                `public/images/QRcodes/books/${book.title}_${book.author}_${
                    book.edition ? book.edition : ''
                }.png`,
                `${book._id}`,
                {
                    color: {
                        dark: '#000', // black dots
                        light: '#fff', // white background background
                    },
                },
                function(err) {
                    if (err) throw err;
                },
            );
        });
    });
};

module.exports = genBooks;
