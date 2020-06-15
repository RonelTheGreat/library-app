var express = require('express'),
    router = express.Router(),
    User = require('../../models/user');

// this will render the user's home page
router.get('/:id/home', function(req, res) {
    // grab the user id
    var user_id = req.params.id;

    // remove unnecessary sessions
    req.session.userloginError = null;

    // find the user
    User.findById(user_id, '_id fname avatar', (err, user) => {
        if (err) return res.redirect('/');

        // if no errors redirect to home page
        req.session.msg = 'new';
        res.render('user/home', { user: user, msg: req.session.msg });
    });
});

module.exports = router;
