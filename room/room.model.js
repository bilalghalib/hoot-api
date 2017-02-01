var log = require('tracer').console({format: "{{message}}  - {{file}}:{{line}}"}).log;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var msg = require('./message.model');

var Room = new Schema({
  members:[{type: Schema.Types.ObjectId, ref: 'User'}],
  messages:[msg]
},{timestamps:true});

module.exports = mongoose.model('Room', Room);