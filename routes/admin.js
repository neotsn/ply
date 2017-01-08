var express = require('express');
var router = express.Router();

// Constant Files
var locales = require('../common/locales');
var credentials = require('../../credentials');

// Models
var User = require('../models/user');
var Organization = require('../models/organization');


/**
 * Begin Orgainzation Routes
 */
router.get('/organization/create', function(req, res) {
    res.render('admin/organization/create');
});

router.post('/organization/save', function(req, res) {
    console.log(req.body);
    res.end();
});

module.exports = router;
