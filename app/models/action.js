var mongoose = require('mongoose');

var actionSchema = mongoose.Schema({
  action: String,
  code: String
}, {collection: 'studentData'});

//Add the model for actions
module.exports = mongoose.model('Action', actionSchema);
