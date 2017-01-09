var express = require('express');
var router = express.Router();

// Constant Files
var locales = require('../common/locales');
var credentials = require('../../credentials');
// var common = require('../common/functions');

// Models
var User = require('../models/user');

/*
 * Begin Authentication Code
 */
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

/** 
 * Passport session setup.
 *    To support persistent login sessions, Passport needs to be able to
 *    serialize users into and deserialize users out of the session.  Typically,
 *    this will be as simple as storing the user ID when serializing, and finding
 *    the user by ID when deserializing.  However, since this example does not
 *    have a database of user records, the complete GitHub profile is serialized
 *    and deserialized.
 */
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

/**
 * Use the GitHubStrategy within Passport.
 *    Strategies in Passport require a `verify` function, which accept
 *    credentials (in this case, an accessToken, refreshToken, and GitHub
 *    profile), and invoke a callback with a user object.
 */
passport.use(new GitHubStrategy({
        clientID: credentials.github.GITHUB_CLIENT_ID,
        clientSecret: credentials.github.GITHUB_CLIENT_SECRET,
        callbackURL: "https://ply-neotsn.c9users.io/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            User.findOrCreate(profile, accessToken, done);
        });
    }
));

/**
 * End Authentication Code
 */

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/login')
// }

/**
 * Routes
 */

// GET home page.
router.get('/', function(req, res, next) {
    res.render('index', {
        TITLE: locales.site.NAME,
        HEADLINE: locales.index.HEADLINE,
        user: req.user
    });
});

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
router.get('/auth/github',
    passport.authenticate('github', {
        scope: ['read:org', 'user:email']
    }),
    function(req, res) {
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
    });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called
router.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/'
    }),
    function(req, res) {
        req.flash('success', 'Successfully logged in');
        res.redirect('/admin');
    });

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
