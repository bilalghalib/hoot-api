var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Hoot = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type:{
    type: Number,  //public hoot = 0
    default: 0     //private hoot = 1
  }
},
{
    timestamps: true
});
Hoot.plugin(mongoosePaginate);

module.exports = mongoose.model('Hoot', Hoot);