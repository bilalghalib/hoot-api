var express = require('express');
var router = express.Router();
var hootCtrl = require('./hoot.controller');
var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var verify = require('../server/verify');


router.route('/')
.get(verify.user ,hootCtrl.listAll)
.post(verify.user, hootCtrl.addHoot);

router.get('/me',verify.user, hootCtrl.getMyHoots);

router.route('/:id')
.get(verify.user,hootCtrl.getHoot)
.put(verify.user)
.delete(verify.user);


module.exports = router;