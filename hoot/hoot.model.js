var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Hoot = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
    timestamps: true
});
module.exports = mongoose.model('Hoot', Hoot);