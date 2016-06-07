// load the things we need
var mongoose = require('mongoose'); //standard mongodb stuff
var bcrypt = require('bcrypt-nodejs'); //password hashing function
var utilities = require('../../app/utilities'); //function to get random string
var codeSchema = require('./code');

// define the schema for our user models
var userSchema = mongoose.Schema({
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },

  // Array of codeSchema
  codes: [codeSchema]
}, {collection: 'users'});


// generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

// generate the code
userSchema.methods.createCode = function () {
  return utilities.getRandString(5);
};

// create the models for users and expose it to our app
module.exports = mongoose.model('userModel', userSchema);
