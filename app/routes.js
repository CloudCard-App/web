module.exports = function (app, passport) { //All the routing is handled here

    // route for home page
    app.get('/', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // route for login form
    // route for processing the login form
    // route for signup form
    // route for processing the signup form

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function (req, res) { //Only calls the second function if isLogged in calls next() if the user is logged in
        res.render('profile.ejs', { //renders into the response yay
            user: req.user // get the user out of session and pass to template
        });
    });

    // route for logging out
    app.get('/logout', function (req, res) {
        req.logout(); //Coming from passport
        res.redirect('/'); //Back to home screen
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']})); //We only need profile and email info (scope)

    // the callback after google has authenticated the user
    // must be the same as set up in the google auth app redirect.
    app.get('/auth/google/callback',
        passport.authenticate('google', { //Provider
            successRedirect: '/profile', //If successful
            failureRedirect: '/' //If the user really sucks at this
        }));

    // Student Stats
    app.get('/studentStats', isLoggedIn, function (req, res) {

        var timeFrame = 1; //Days to aggregate
        var userCode = req.user.code;
        console.log("userCode: " + userCode);
        var documentCount = 0;

        var Action = require('../app/models/action');

        //Action.find({code: userCode}, function(err, data) {
        //    if (err) {
        //        console.error("Could not find with code!");
        //    } else {
        //        data.count(function (err, count) {
        //            //documentCount = count;
        //            //var graphData[count / timeFrame][2];
        //
        //            console.log("Count: " + count);
        //            console.log("Here's the JSON: ");
        //            data.forEach(function(obj) {
        //                console.log(obj.id);
        //            })
        //
        //        });
        //        console.log("The data is: ");
        //        console.log(data);
        //    }
        //});

        Action.find({code: userCode}).exec(function (err, results) {
            var count = results.length;
            console.log("Count: " + count);
            console.log("results: " + results);

            console.log();

            var timeIntervalToSmooth = 2;

            // Create new empty two dimensional array
            var data = new Array(count);
            console.log("Data size: " + data.length);
            for (var i = 0; i < data.length; i++) {
                console.log("i = " + i);
                data[i] = new Array(2);
            }

            data[0][0] = "Time";
            data[0][1] = "Number of Users";

            var insertionIndex = 1;

            var currentUsers = 0;

            var firstTime = Date.parse(results[0]._id.getTimestamp());
            var lastCountedTime = firstTime;
            for (var i = 0; i < count; i++) {
                var thisJSON = results[i];
                console.log("thisJSON: " + thisJSON);
                if (thisJSON.action === "enterstudy") {
                    currentUsers++;
                    console.log("Adding current users!");
                } else if (thisJSON.action === "exitstudy") {
                    currentUsers--;
                    console.log("Subtracting current users!");
                }
                var timeStamp = new Date(thisJSON._id.getTimestamp());
                console.log("Timestamp: " + timeStamp);

                if (timeStamp - lastCountedTime >= timeIntervalToSmooth) {
                    lastCountedTime = timeStamp;
                    var timeString = timeStamp.toString();
                    data[insertionIndex][0] = timeString;
                    data[insertionIndex][1] = +currentUsers;
                    insertionIndex++;
                    console.log("Wrote into array! insertionIndex = " + insertionIndex);
                }
            }

            console.log("Here comes the data: -------------------------------");
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);
            }

            res.render('graphs.ejs', {
                graphData: data
            })

        });

        //res.render('graphs.ejs', {
        //    graphData: [
        //        ["Year", "Sales", "Expenses"],
        //        ["2004", 1000, 400],
        //        ["2005", 1170, 460],
        //        ["2006", 660, 1120],
        //        ["2007", 1030, 540]
        //    ]
        //});
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