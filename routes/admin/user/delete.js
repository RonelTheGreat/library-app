var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    User = require('../../../models/user');

// this will delete the user
router.post('/delete', function(req, res) {
    // find the specific user to delete
    User.findByIdAndRemove(req.body.id, (err, user) => {
        if (err) return res.json({ success: false });

        // if found
        // set the avatar file path to delete
        let avatarToDelete = `public/images/avatars/${user.avatar}`;
        // remove avatar
        fs.unlink(avatarToDelete, err => {
            if (err) return console.log('cant delete avatar');

            // if avatar has been deleted
            // remove qr code
            let qrCodeToDelete = `public/images/QRcodes/users/${user.fname}_${user.mi}_${user.lname}.png`;
            fs.unlink(qrCodeToDelete, err => {
                if (err) return console.log('cant delete qr code');

                // if successfully deleted QR code and avatar
                // flash a message that the user has been
                // successfully deleted
                res.json({ success: true });
            });
        });
    });
});

module.exports = router;
