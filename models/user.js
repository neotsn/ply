// Credentials
var credentials = require('../../credentials');

var mongoose = require('mongoose');
mongoose.connect(credentials.mongo.CONNECTION_STRING);
var db = mongoose.connection;

// User Model
var UserSchema = mongoose.Schema({

    // Github Details
    githubId: {
        type: 'string',
        index: true
    },
    accessToken: {
        type: 'string'
    },
    displayName: {
        type: 'string'
    },
    username: {
        type: 'string'
    },
    avatarUrl: {
        type: 'string'
    },
    _raw: {
        type: 'string'
    },
    _json: {
        type: 'string'
    },
    // Ply Details
    email: {
        type: 'string'
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {

    // bcrypt.genSalt(10, function(err, salt) {
    //     if (err) throw err;
    //     bcrypt.hash(newUser.password, salt, function(err, hash) {
    //         if (err) throw err;
    //         newUser.password = hash;
    //         newUser.save(callback);
    //     });
    // });
};

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByGithubId = function(githubId, callback) {

    var query = {
        githubId: githubId
    };
    User.findOne(query, callback);
};

module.exports.getUserByUsername = function(username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback); // Just getting one record
};

module.exports.findOrCreate = function(profile, accessToken, done) {

    User.findOne({
        githubId: profile.id
    }, function(err, user) {
        if (err) return done(err);

        // No user was found...
        if (!user) {
            user = new User({
                // Github Details, plucked
                githubId: profile.id,
                accessToken: accessToken,
                displayName: profile.displayName,
                username: profile.username,
                avatarUrl: profile._json.avatar_url,
                github: profile._json,
                // Ply Fields
                email: ''
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        }
        else {
            //found user. Return
            return done(err, user);
        }
    });
}
