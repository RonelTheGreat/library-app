var express = require('express'),
    router = express.Router(),
    User = require('../../models/user');

// this will authenticate the QR code of the user
router.post('/auth', function(req, res) {
    // grab the id of the user
    var user_id = req.body.id;
    // remove unnecessary sessions
    req.session.msg = null;

    // find the specific user
    User.findById(user_id, '_id', (err, user) => {
        // if QR code is not valid
        // flash an error message
        if (err) {
            req.session.userloginError = 'Invalid QR Code';
            return res.redirect('/');
        }

        if (user === null) {
            req.session.userloginError = 'Invalid QR Code';
            return res.redirect('/');
        }

        // if no error occurs
        // redirect user to home page
        res.redirect(`/user/${user._id}/home`);
    });
});

module.exports = router;
