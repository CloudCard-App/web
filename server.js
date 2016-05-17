// set up =====================================================================
// get all the tools we need
var express = require('express');
var app = express(); //Create our app, using our new superpowers
var mongoose = require('mongoose'); //For MongoDB
var passport = require('passport'); //Allows us to do authentication
var flash = require('connect-flash'); //Flash messages in session

var morgan = require('morgan'); //Logs HTTP requests
var cookieParser = require('cookie-parser'); //Parses cookie info
var bodyParser = require('body-parser'); //Parses HTTP PUT and POST bodies
var configDB = require('./config/database.js'); //Configuration stuff the db

var session = require('express-session'); //Sessions.

// Commander to get command line arguments
var program = require('commander');
program
    .option('-d --dbIP <dbIP>', 'IP address of database', String)
    .option('-e --extIP <externalIP>', 'External IP address', String, 'localhost')
    .option('-p --port <port>', 'Port to listen on', Number, process.env.PORT || 8080);

program.parse(process.argv);

// DB configuration and setup =================================================
if (program.dbIP) {
    mongoose.connect(program.dbIP); // connect to argumented database
} else {
    mongoose.connect(configDB.studentData); // use default configuration file
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    app.listen(program.port, program.extIP); // listen for connections
    console.log("Listening on port     " + program.port);
});

// Passport configuration and setup ===========================================
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating. HTML, awesomified.

// signs sessions using this secret : required thing
app.use(session({secret: 'amalgamation'})); 

app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize()); //initalizes passport
app.use(passport.session()); // persistent login sessions

app.use(flash()); // use connect-flash for flash messages stored in session

// load our routes and pass in our app and fully configured passport ==========
require('./app/routes.js')(app, passport);
