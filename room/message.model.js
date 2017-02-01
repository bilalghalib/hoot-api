var log = require('tracer').console({format: "{{message}}  - {{file}}:{{line}}"}).log;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Message = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  hoot: {
    type: Schema.Types.ObjectId,
    ref: 'Hoot'
  }
},{timestamps: true});

module.exports = Message;