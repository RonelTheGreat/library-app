var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    fs = require('fs'),
    User = require('../../../models/user');

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

// this will render the edit page
router.get('/:id/edit', function(req, res) {
    // if not an admin redirect to login page
    if (!req.session.isValidated) return res.redirect('/admin/login');

    // find the user to edit
    User.findOne(
        { _id: req.params.id },
        '_id fname mi lname contact fine avatar',
        (err, user) => {
            if (err) return res.redirect('/admin/show/all');
            // if there is no error
            // render edit page with the user's information
            res.render('admin/user/edit', { user: user });
        }
    );
});

// this will process the editing of a user
// without updating the photo
router.post('/edit_without_photo', function(req, res) {
    // grab all the user's information
    let {
        fname,
        mi,
        lname,
        id,
        fine,
        avatar_filename,
        contact
    } = req.body.user;

    // get avatar filename extension i.e. png, jpeg or gif etc.
    let filenameExt = avatar_filename.split('.')[1];

    // find the user to edit
    User.findById(id, 'fname mi lname avatar contact fine', (err, user) => {
        if (err) return console.log('something went wrong finding user ...');

        // if there are no errors
        // set the new avatar filename
        let newAvatar = `${fname.toLowerCase()}_${mi.toLowerCase()}_${lname.toLowerCase()}.${filenameExt}`;

        // update user's information
        user.fname = fname.toLowerCase();
        user.lname = lname.toLowerCase();
        user.mi = mi.toLowerCase();
        user.contact = contact;
        user.fine = fine;
        user.avatar = newAvatar;
        user.save();

        // rename avatar with the updated user's fullname
        fs.renameSync(
            `public/images/avatars/${avatar_filename}`,
            `public/images/avatars/${newAvatar}`
        );

        // flash a message that the user is successfully updated
        res.json({ success: true });
    });
});

// this will process the editing of a user
// uploading a new photo
router.post('/edit_with_photo', upload.single('avatar'), function(req, res) {
    // grab the user's information
    let { fname, mi, lname, id, contact } = req.body.user;
    // grab the new photo's filename
    let { originalname } = req.file;

    // find the user to edit
    User.findById(id, 'fname mi lname contact avatar', (err, user) => {
        if (err) return console.log('something went wrong finding user ...');

        // if there are no errors
        // grab the path of the old photo
        let avatarToDelete = `public/images/avatars/${user.avatar}`;

        // delete old photo
        fs.unlink(avatarToDelete, err => {
            if (err) return console.log(err);

            // grab the file extension
            let fileExtension = originalname.split('.')[1];
            // set the new avatar name
            let newAvatar = `${fname}_${mi}_${lname}.${fileExtension}`;

            // update photo after successful deletion
            fs.renameSync(
                `public/images/avatars/${originalname}`,
                `public/images/avatars/${newAvatar}`
            );

            // update user info
            user.fname = fname.toLowerCase();
            user.mi = mi.toLowerCase();
            user.lname = lname.toLowerCase();
            user.contact = contact;
            user.avatar = newAvatar;
            user.save();

            // flash a message that the user
            // is successfully edited
            res.json({ success: true });
        });
    });
});

module.exports = router;
