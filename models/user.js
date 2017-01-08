var mongoose = require('mongoose');

// User Model
var UserSchema = mongoose.Schema({

    // Github Details
    githubId: {
        type: String,
        index: true
    },
    accessToken: String,
    displayName: String,
    username: String,
    avatarUrl: String,
    _json: String,

    // Ply Details
    email: String,
    organizations: [String],
    teams: [String]

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

module.exports.addOrg = function(orgId, userId) {

    var update = {
        "$push": {
            "organizations": orgId
        }
    };

    User.findByIdAndUpdate(userId, update);
}

module.exports.findOrCreate = function(profile, accessToken, done) {

    User
        .findOne({
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
                    email: '',
                    organizations: [],
                    teams: []
                });

                user.save(function(err) {
                    if (err) throw err;
                    return done(err, user);
                });
            }
            else {

                var update = {
                    "$set": {
                        "accessToken": accessToken
                    }
                };

                User.findByIdAndUpdate(user._id, update,
                    function(err, user) {
                        return done(err, user);
                    }
                );
            }
        });
}
