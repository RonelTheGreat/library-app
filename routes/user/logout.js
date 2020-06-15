var express = require('express'),
    router = express.Router();

// this will logout the user once transaction is done
router.get('/:id/logout', function(req, res) {
    // remove all the session pertaining to the user
    req.session.destroy(function() {
        res.redirect('/');
    });
});

module.exports = router;
