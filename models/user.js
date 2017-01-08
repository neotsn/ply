var mongoose = require('mongoose');

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
    },
    organizations: {
        type: 'string'
    },
    teams: {
        type: 'string'
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByGithubId = function(githubId, callback) {

    var query = {
        githubId: githubId
    };
    User.findOne(query, callback);
};

module.exports.findOrCreate = function(profile, accessToken, done) {

    User
        .findOne({
            githubId: profile.id
        }, function(err, user) {

            if (err) return done(err);

            console.log(user);

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
                console.log('saving');
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            }
            else {

                // var query = {
                //         githubId: profile.id
                //     },
                //     update = {
                //         '$set': {
                //             accessToken: accessToken
                //         }
                //     };

                // User
                //     .findAndModify(query, update,
                //         function(err, user) {
                console.log('found');
                console.log(user);
                return done(err, user);
                // });
            }
        });
}
