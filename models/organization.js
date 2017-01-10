var mongoose = require('mongoose');

// User Model
var OrganizationSchema = mongoose.Schema({

    // Admin Data
    creatorUserId: String,
    subdomain: {
        type: String,
        index: true
    },
    name: String,
    description: String,

    // Associations
    users: [String],
    teams: [String],

    // Meta Data
    org_logo: String
});

var Organization = module.exports = mongoose.model('Organization', OrganizationSchema);

// Get a single ogranization by _id
module.exports.getOrgById = function(id, callback) {
    Organization.findById(id, callback);
};

// Get a single organization by subdomain
module.exports.getOrgBySubdomain = function(subdomain, callback) {
    var query = {
        subdomain: subdomain
    };
    Organization.findOne(query, callback);
};

module.exports.createOrg = function(newOrg, callback) {

    var query = {
        "subdomain": newOrg.subdomain
    };

    Organization
        .findOne(
            query,
            function(err, existingOrg) {
                if (err) throw err;

                if (existingOrg) {
                    callback(err, false);
                }
                else {
                    newOrg.save(callback);
                }
            });
};


// module.exports.getUserByGithubId = function(githubId, callback) {

//     var query = {
//         githubId: githubId
//     };
//     User.findOne(query, callback);
// };

// module.exports.findOrCreate = function(profile, accessToken, done) {

//     User.findOne({
//         githubId: profile.id
//     }, function(err, user) {
//         if (err) return done(err);

//         // No user was found...
//         if (!user) {
//             user = new User({
//                 // Github Details, plucked
//                 githubId: profile.id,
//                 accessToken: accessToken,
//                 displayName: profile.displayName,
//                 username: profile.username,
//                 avatarUrl: profile._json.avatar_url,
//                 github: profile._json,
//                 // Ply Fields
//                 email: ''
//             });
//             user.save(function(err) {
//                 if (err) console.log(err);
//                 return done(err, user);
//             });
//         }
//         else {
//             //found user. Return
//             return done(err, user);
//         }
//     });
// }
