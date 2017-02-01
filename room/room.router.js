var express = require('express');
var router = express.Router();
var roomCtrl = require('./room.controller.js');
var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var verify = require('../server/verify');


router.get('/',verify.user,roomCtrl.getAllRooms);

router.get('/:receiverId',verify.user,roomCtrl.getRoom);


router.route('/:roomId/message')
  .get(verify.user,roomCtrl.getAllMessages)
  .post(verify.user,roomCtrl.newMessage);






module.exports = router;