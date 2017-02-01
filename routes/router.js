var express = require('express');
var users =  require('../users/user.router');
var hoot =  require('../hoot/hoot.router');
var room =  require('../room/room.router');

var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var verify = require('../server/verify');

module.exports = function (app, config, models) {
  var router = express.Router();

  router.use('/users',users);
  router.use('/hoot',hoot);
  router.use('/room',room);






  app.use('/api', router);
};
