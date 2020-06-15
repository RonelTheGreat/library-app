var express = require('express'),
    router = express.Router(),
    QRCode = require('qrcode'),
    multer = require('multer'),
    User = require('../../../models/user'),
    fs = require('fs');

// SET STORAGE FOR UPLOADS
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/avatars');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

// add new user
router.get('/reg_user', (req, res) => {
    // empty unnecessary sessions
    req.session.loginErrors = null;
    req.session.adminRegErrors = null;
    req.session.bookRegErrors = null;
    req.session.success = null;
    req.session.username = null;
    req.session.inputValues = null;

    // if not an admin, redirect to login page
    if (!req.session.isValidated) return res.redirect('/admin/login');

    // if an admin, show the registration page
    res.render('admin/user/register');
});

// this will process the registration of a new user
router.post('/reg_user', upload.single('avatar'), (req, res) => {
    // grab firstname, middle initial, last name and contact
    var fname = req.body.fname.toLowerCase();
    var lname = req.body.lname.toLowerCase();
    var mi = req.body.mi.toLowerCase();
    var contact = req.body.contact;

    // check for empty fields
    req.checkBody('fname', 'first name is required').notEmpty();
    req.checkBody('lname', 'last name is required').notEmpty();
    req.checkBody('mi', 'middle initial is required').notEmpty();
    req.checkBody('contact', 'contact number is required').notEmpty();

    // this will hold all the errors
    let errors = req.validationErrors();

    // if there is an error
    // flash the corresponding error
    // to the admin
    if (errors) {
        res.json({ errors: errors });
        // if there is not photo
        // flash a message to admin that it is required
    } else if (req.file === undefined) {
        res.json({ hasAvatar: false });

        // if there are no errors
    } else {
        // grab the file name of the photo
        let originalFileName = req.file.originalname;
        // grab the file extension of the photo e.g. png, jpeg etc.
        let fileExtension = originalFileName.split('.')[1];
        // set the new name of the photo
        // to this format firstname_mi_lastname.fileExtension
        // e.g. ronel carlo_o_berino.png
        let newAvatar = `${fname}_${mi}_${lname}.${fileExtension}`;

        // then save the new name of the photo
        fs.renameSync(
            `public/images/avatars/${originalFileName}`,
            `public/images/avatars/${newAvatar}`
        );

        // grab all the users information
        // before savign to DB
        let user = {
            fname: fname.toLowerCase(),
            lname: lname.toLowerCase(),
            mi: mi.toLowerCase(),
            contact: contact,
            avatar: newAvatar
        };

        // create the new user
        User.create(user, (err, user) => {
            if (err) return console.log('Error creating user ...');

            // GENERATE a QR CODE
            // set the name of the QR code to the fullname of the user
            QRCode.toFile(
                `public/images/QRcodes/users/${fname}_${mi}_${lname}.png`,
                `${user._id}`,
                {
                    color: {
                        dark: '#000', // black dots
                        light: '#fff' // white background
                    }
                },
                function(err) {
                    if (err) throw err;
                }
            );

            // empty session
            req.session.userRegErrors = null;
            // flash a message that the user
            // have been successfully registered
            res.json({ success: true });
        });
    }
});

module.exports = router;
