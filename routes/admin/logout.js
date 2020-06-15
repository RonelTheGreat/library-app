var express = require('express'),
    router = express.Router();

// this will logout an admin
router.get('/logout', function(req, res) {
    // clear previous sessions
    req.session.inputValues = null;
    req.session.isValidated = false;
    // then redirect to login page
    res.redirect('/admin/login');
});

module.exports = router;
