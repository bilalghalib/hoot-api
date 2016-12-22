var Hoot = require('./hoot.model');
var passport = require('passport');
var Verify = require('../server/verify.js');
var mkdirp = require('mkdirp');
var base64 = require('base64-stream');
var path = require ('path');
var stream = require('stream');
var fs = require('fs');
var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var s3Uploader = require('../server/s3uploader');
var cloudConvert = require('../server/cloudConvert');
var request = require('request');

exports.listAll = function (req, res, next) {
  Hoot.find({})
  .populate('user')
  .exec(function (err, users) {
    if (err) throw err;
    res.json(users);
  });
};

exports.addHoot = function(req,res){
  // var hoot = new Hoot({
  //     user: req._user._id
  //   })

  if(req.body.type == "amr") {
    cloudConvert.convertAudio(req.body).then(function (res) {
      log(res);
    }, function (err) {
      log(err);
    });
  }
   
  
  else {
    s3Uploader.uploadBase64(req.body).then(function (res) {
      log(res);
    }, function (err) {
      log(err);
    });
  }
  return res.json({
    message : 'Uploading Hoot',
    data : null,
    success : true
  });

};


exports.getMyHoots = function(req, res){
  Hoot.find({user: req._user._id})
  .populate('user')
  .exec(function(err, hoots){
     if(err){
        return res.status(500).json({
          message: 'Could not get hoot',
          success: false,
          data : null
        });
      }
      return res.json({
        message : 'Hoot sent',
        data : hoots,
        success : true
      })
  });
};


exports.getHoot = function(req, res){
   var hootId = req.params.id;
   Hoot.findOne({_id: hootId})
  .populate('user')
  .exec(function(err, hoot){
    log(hoot);
     if(err){
        return res.status(500).json({
          message: 'Could not get hoot',
          success: false,
          data : null
        });
      }
      return res.json({
        message : 'Hoot sent',
        data : hoot,
        success : true
      })
  });
};

