var Hoot = require('./hoot.model');
var User = require('../users/user.model');
var passport = require('passport');
var Verify = require('../server/verify.js');
var mkdirp = require('mkdirp');
var base64 = require('base64-stream');
var path = require('path');
var stream = require('stream');
var fs = require('fs');
var log = require('tracer').console({format: "{{message}}  - {{file}}:{{line}}"}).log;
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

exports.getHoots = function (req,res) {
  log(req.query);
  var readHoots = [];
  User.findOne({_id:req._user._id},'read', function (err, user) {
    readHoots = user.read;
    log(readHoots);
    if (err) {
      return res.status(500).json({
        message: 'Could not get user',
        success: false,
        data: err
      });
    }
    Hoot.paginate({user:{$ne:req._user._id},_id:{$nin:readHoots}},{offset:parseInt(req.query.offset),limit:parseInt(req.query.limit)},
      function (err,hoots) {
        if (err) {
          return res.status(500).json({
            message: 'Could not get hoot',
            success: false,
            data: err
          });
        }
        return res.json({
          message: 'List all hoots',
          data: hoots.docs,
          success: true
        });
      })
  });
  //log(readHoots);

};

exports.hootRead = function (req,res) {
  User.findOne({_id:req._user._id}, function (err, user) {
    if (err) throw err;
    for(var read in user.read){
      if(user.read[read] == req.params.hid){
        return res.status(200).json({
          message: 'Hoot Already Read',
          success: true,
          data: null
        });
      }
    }

    user.read.push(req.params.hid);
    user.save(function (err,newUser) {
      if (err) {
        return res.status(500).json({
          message: 'Could not get hoot',
          success: false,
          data: err
        });
      }
      return res.json({
        message: 'Hoot sent',
        data: newUser,
        success: true
      });
    });
  });
};

exports.addHoot = function (req, res) {
  // var hoot = new Hoot({
  //     user: req._user._id
  //   })
  var data = req.body;
  var hoot = new Hoot({
    user: req._user
  });
  var name = hoot._id;
  log(name);
  if (req.body.type == "amr") {
    cloudConvert.convertAudio(data, name).then(function (res) {
      log(res);
      hoot.save(function (err, hoots) {
      });
    }, function (err) {
      log(err);
    });
  }


  else {
    s3Uploader.uploadBase64(data, name).then(function (res) {
      log(res);
      hoot.save(function (err, hoots) {
      });
    }, function (err) {
      log(err);
    });
  }
  return res.json({
    message: 'Uploading Hoot',
    data: null,
    success: true
  });

};


exports.getMyHoots = function (req, res) {
  Hoot.find({user: req._user._id})
    .populate('user')
    .exec(function (err, hoots) {
      if (err) {
        return res.status(500).json({
          message: 'Could not get hoot',
          success: false,
          data: null
        });
      }
      return res.json({
        message: 'Hoot sent',
        data: hoots,
        success: true
      })
    });
};


exports.getHoot = function (req, res) {
  var hootId = req.params.id;
  Hoot.findOne({_id: hootId})
    .populate('user')
    .exec(function (err, hoot) {
      log(hoot);
      if (err) {
        return res.status(500).json({
          message: 'Could not get hoot',
          success: false,
          data: null
        });
      }
      return res.json({
        message: 'Hoot sent',
        data: hoot,
        success: true
      })
    });
};

