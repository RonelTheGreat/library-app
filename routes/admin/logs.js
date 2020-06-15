var express = require('express'),
    Log = require('../../models/log'),
    router = express.Router();

// this will render all the logs
router.get('/show/logs', function(req, res) {
    // empty unnecessary session
    req.session.loginErrors = null;
    req.session.success = null;
    req.session.regErrors = null;
    req.session.inputValues = null;

    // if not an admin, redirect to login page
    if (!req.session.isValidated) return res.redirect('/admin/login');

    // if no errors, render logs
    res.render('admin/logs');
});

// this will process what logs to view
router.get('/show/:category/logs', function(req, res) {
    // if not an admin, redirect to login page
    if (!req.session.isValidated) return res.redirect('/admin/login');

    // if an admin then find all the logs
    // that matches the category (i.e. borrowed or returned) logs
    Log.find({ logName: req.params.category })
        // sort according to date
        .sort([['timestamp', 'descending']])
        .exec((err, logs) => {
            if (err) return console.log(`ERROR FINDING LOGS: ${err}`);

            // if there are logs for the particular category
            // then render all the logs
            if (logs.length > 0) {
                res.json({ success: true, logs: logs });
                // if there are no logs found
                // do nothing
            } else {
                res.json({ success: false });
            }
        });
});

module.exports = router;
