var Hoot = require('./hoot.model');
var passport = require('passport');
var Verify = require('../server/verify.js');
var mkdirp = require('mkdirp');
var base64 = require('base64-stream');
var path = require ('path');
var stream = require('stream');
var fs = require('fs');
var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;

exports.listAll = function (req, res, next) {
  Hoot.find({})
  .populate('user')
  .exec(function (err, users) {
    if (err) throw err;
    res.json(users);
  });
};

exports.addHoot = function(req,res){
  var hoot = new Hoot({
      user: req._user._id
    })
  var audio = req.body.audio;
  var usID = req._user._id;
  log(__dirname);
 
    hoot.save(function(err,hoot){
      var hootID = hoot._id;
      hootID = hootID.toString();
      log(hootID);
       mkdirp(path.join(__dirname,'../public/' ,usID), function(err) { 


   var base64Data = audio.replace(/^data:audio\/amr;base64,/, "");

fs.writeFile(path.join(__dirname,'../public/' ,usID,'/',hootID+'.amr'), base64Data, 'base64', function(err) {
  log(err);
    console.log("The file was saved!");

});
    //   fs.writeFile(hootID+'.amr', binAudio , function(err) {
    // if(err) {
    //     return console.log(err);
    // }



});




      if(err){
        return res.status(500).json({
          message: 'Could not add hoot',
          success: false,
          data : null
        });
      }
      return res.json({
        message : 'Hoot added',
        data : hoot,
        success : true
      })
    })  
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

