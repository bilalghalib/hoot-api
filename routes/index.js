var express = require('express');
var users =  require('./users');
var console = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"});
var verify = require('../server/verify');

module.exports = function (app, config, models) {
  var router = express.Router();

  router.use('/users',users);










  app.use('/api', router);
};
