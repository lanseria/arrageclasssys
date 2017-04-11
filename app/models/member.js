var mongoose = require('mongoose');
var memberSchema = require('../schemas/member');
var member = mongoose.model('Member', memberSchema);

module.exports = member