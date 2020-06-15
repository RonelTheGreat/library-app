var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    edition: String,
    yearPublished: Number,
    publisher: String,
    validity: Number,
    dateBorrowed: String,
    dueDate: String,
    isBorrowed: { type: Boolean, default: false },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    fine: Number,
    notif: {
        dateNotified: String,
        isNotified: { type: Boolean, default: false },
    },
});

module.exports = mongoose.model('Book', bookSchema);
