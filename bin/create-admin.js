var bcrypt = require('bcrypt'),
    User = require('../models/user');

/**
 * create admin IF AND ONLY IF
 * this program runs for the first time
 * @param {String} username username of the admin
 * @param {String} password password of the admin
 */
function createAdmin(username, password) {
    // hash the password for privacy
    bcrypt.hash(password, 10, (err, hashedPW) => {
        // save the new credentials and hashed pw
        let newAdmin = {
            username: username,
            password: hashedPW,
            isAdmin: true
        };

        if (err) return console.log('Error hashing the password');

        // if no errors
        // create new admin
        User.create(newAdmin, (err, newAdmin) => {
            if (err) return console.log('Error in creating a new admin ...');

            // if no error, flash a message
            console.log('A new admin is created ...');
        });
    });
}

module.exports = createAdmin;
