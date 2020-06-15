var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    mi: String,
    contact: String,
    borrowedBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        },
    ],
    avatar: String,
    username: String,
    password: String,
    fine: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
