var express = require('express');
var router = express.Router();
var userCtrl = require('../controller/user');
var console = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"});
var verify = require('../server/verify');

/* GET users listing. */
router.get('/',verify.user,userCtrl.listAll);

router.post('/register',userCtrl.register);

router.post('/login',userCtrl.login);

router.get('/logout',userCtrl.logout);

module.exports = router;