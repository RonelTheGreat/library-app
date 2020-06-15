// DEPENDENCIES
var bodyParser = require('body-parser'),
    validator = require('express-validator'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    express = require('express'),
    PORT = process.env.PORT || 3000,
    app = express();

require('./bin/serial-com');

// MONGODB CONNECTION
mongoose.connect('mongodb://localhost/lib_app');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(validator());
app.use(
    session({
        secret: 'th1s 1s @ r@nd0m s3cr3t k3y',
        resave: false,
        saveUninitialized: true
    })
);

// ROUTES
app.use('/', require('./routes/landing'));

// USER ROUTES
app.use('/user', require('./routes/user/auth'));
app.use('/user', require('./routes/user/home'));
app.use('/user', require('./routes/user/borrow'));
app.use('/user', require('./routes/user/return'));
app.use('/user', require('./routes/user/logout'));

// ADMIN ROUTES
app.use('/admin', require('./routes/admin/login'));
app.use('/admin', require('./routes/admin/logout'));
app.use('/admin', require('./routes/admin/add'));
app.use('/admin', require('./routes/admin/logs'));
app.use('/admin', require('./routes/admin/admins'));

// ADMIN [BOOK] ROUTES
app.use('/admin', require('./routes/admin/book/all'));
app.use('/admin', require('./routes/admin/book/available'));
app.use('/admin', require('./routes/admin/book/borrowed'));
app.use('/admin', require('./routes/admin/book/edit'));
app.use('/admin', require('./routes/admin/book/delete'));
app.use('/admin', require('./routes/admin/book/add'));

// ADMIN [USER] ROUTES
app.use('/admin', require('./routes/admin/user/users'));
app.use('/admin', require('./routes/admin/user/register'));
app.use('/admin', require('./routes/admin/user/delete'));
app.use('/admin', require('./routes/admin/user/edit'));

// SERVER LISTENER
app.listen(PORT, function() {
    console.log(`listening to port ${PORT}`);
});
