var mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
    logName: String,
    borrower: String,
    book: {
        title: String,
        author: String,
        edition: String,
        yearPublished: Number,
        publisher: String,
        validity: Number,
    },
    date: {
        dateBorrowed: String,
        dueDate: String,
        dateReturned: String,
    },
    fine: Number,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', logSchema);
