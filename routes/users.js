var express = require('express');
var router = express.Router();

var locales = require('../common/locales');

// Models
// var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    //   res.send('respond with a resource');
    res.end();
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
