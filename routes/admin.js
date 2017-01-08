var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({
    dest: 'public/images/uploads'
});

// Constant Files
var locales = require('../common/locales');
var credentials = require('../../credentials');
var common = require('../common/functions');

// Models
var User = require('../models/user');
var Organization = require('../models/organization');

/**
 * Begin Admin Root Routes
 */
router.get('/', common.ensureAuthenticated, function(req, res) {

    // Set up the dashboard information

    res.render('admin/dashboard', {
        user: req.user
    });

    res.end();
})

/**
 * Begin Orgainzation Routes
 */
router.get('/organization/create', common.ensureAuthenticated, function(req, res) {
    res.render('admin/organization/create', {
        user: req.user
    });
});

router.post('/organization/save', upload.single('org_logo'), common.ensureAuthenticated, function(req, res) {

    // Form Validation
    req.checkBody('org_subdomain', 'An organization subdomain is required.').notEmpty();
    req.checkBody('org_name', 'An organization name is required.').notEmpty();

    var errors = req.validationErrors() || [];
    var filename;
    var profileimage = req.file;

    if (profileimage) {

        if (common.isValidImageFile(profileimage)) {
            filename = profileimage.filename;
        }
        else {
            errors.push({
                msg: 'Invalid file type.'
            });
        }
    }
    else {
        filename = 'default.png';
    }

    if (errors.length) {
        res.render('/organization/create', {
            validationErrors: errors
        });
    }
    else {
        var newOrg = new Organization({
            creatorUserId: req.user._id,
            name: req.body.org_name,
            subdomain: req.body.org_subdomain,
            description: req.body.org_description,
            org_logo: filename,
            teams: [],
            users: [req.user._id]
        });

        Organization.createOrg(newOrg, function(err, organization) {
            if (err) throw err

            if (!organization) {
                errors.push({
                    msg: 'Organization Subdomain already exists'
                });

                res.render('/organization/create', {
                    validationErrors: errors
                });
            }
            else {
                User.addOrg(organization._id, req.user._id);
            }

        });

        req.flash('success', 'Organization successfully created');
        res.redirect('/admin');
    }


    res.end();
});

module.exports = router;
