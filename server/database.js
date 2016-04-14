var config = require('../config/config');
var mongoose = require('mongoose');
var console = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"});

exports.connect = function (){
  mongoose.connect(config.mongoUrl);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    // we're connected!
    console.log("MongoDB connected on "+ config.mongoUrl);
    console.log("###########################################################################");
  });
};

