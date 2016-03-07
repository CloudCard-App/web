module.exports = function (app, passport) { //All the routing is handled here

    // route for home page
    app.get('/', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.post('/createDeck', isLoggedIn, function (req, res) {

        var utilities = require('./utilities');
        var mongoose = require('mongoose');
        var codeSchema = require('./models/code');
        var codeModel = mongoose.model('Code', codeSchema);

        var randomCode = utilities.getRandString(5);
        var deckName = req.body.newDeckName;
        var deckLink = req.body.newDeckLink;

        var newCode = new codeModel({
            code: randomCode,
            name: deckName,
            link: deckLink
        });

        var userModel = require('./models/user');
        userModel.findOne({'google.id': req.user.google.id},
            function (err, user) {
            user.codes.push(newCode);
            user.save();
            res.redirect('/profile/');
        });
    });

    // Route for showing the profile page
    // Only calls the second function if isLogged in calls next()
    // if the user is logged in
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', { //renders into the response yay
            user: req.user // get the user out of session and pass to template
        });
    });

    // route for logging out
    app.get('/logout', function (req, res) {
        req.logout(); //Coming from passport
        res.redirect('/'); //Back to home screen
    });

    // Sends to google to do the authentication
    // The profile gets us their basic information including their name
    // email gets their emails

    //We only need profile and email info (scope)
    app.get('/auth/google', passport.authenticate('google',
        {scope: ['profile', 'email']}));


    // the callback after google has authenticated the user
    // must be the same as set up in the google auth app redirect.
    app.get('/auth/google/callback',
        passport.authenticate('google', { //Provider
            successRedirect: '/profile', //If successful
            failureRedirect: '/' //If the user really sucks at this
        }));

    // Student Stats
    app.get('/studentStats/*', isLoggedIn, function (req, res) {

        var url = req.url;
        var code = url.substr(url.lastIndexOf("/") + 1, url.length);
        var Action = require('../app/models/action');

        Action.find({code: code}).exec(function (err, results) {
            var count = results.length;
            if (count > 0) {

                var timeIntervalToSmooth = 2;

                // Create new empty two dimensional array
                var data = new Array(count);
                for (var i = 0; i < data.length; i++) {
                    data[i] = new Array(2);
                }

                data[0][0] = "Time";
                data[0][1] = "Number of Users";

                var insertionIndex = 1;

                var currentUsers = 0;

                var lastCountedTime = Date.parse(results[0]._id.getTimestamp());
                for (var i = 0; i < count; i++) {
                    var thisJSON = results[i];
                    if (thisJSON.action === "enterstudy") {
                        currentUsers++;
                    } else if (thisJSON.action === "exitstudy") {
                        currentUsers--;
                    }
                    var timeStamp = new Date(thisJSON._id.getTimestamp());

                    if (timeStamp - lastCountedTime >= timeIntervalToSmooth) {
                        lastCountedTime = timeStamp;
                        data[insertionIndex][0] = timeStamp.toString();
                        data[insertionIndex][1] = +currentUsers;
                        insertionIndex++;
                    }
                }
                res.render('studentStats.ejs', {
                    graphData: data
                })
            } else {
                var profilePath = "../../profile/";
                res.render('nodata.ejs', {profilePath: profilePath});
            }
        });
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next(); //Authenticated! carry on...

    // if they aren't redirect them to the home page
    res.redirect('/');
}