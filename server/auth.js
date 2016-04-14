var console = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var config = require('../config/config');

//Setup Local Login Strategy
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());