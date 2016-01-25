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

    app.post('/studentPost', function (req, res) {
        var body = req.body;
        console.log("Body of post: " + JSON.stringify(body));
        res.status(200);
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