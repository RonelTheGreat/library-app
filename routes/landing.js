var express = require('express'),
    router = express.Router();

// this will render the landing page
router.get('/', function(req, res) {
    res.render('landing', { error: req.session.userloginError });
});

module.exports = router;
