var mongoose = require('mongoose');

var codeSchema = mongoose.Schema({
    code: String,
    name: String,
    link: String
}, {collection: 'codes'});

module.exports = codeSchema;