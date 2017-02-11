var Room = require('./room.model.js');
var User = require('../users/user.model');
var Verify = require('../server/verify.js');
var log = require('tracer').console({format: "{{message}}  - {{file}}:{{line}}"}).log;
var mongoose = require('mongoose');
var hoot = require('../hoot/hoot.controller')
var _ = require('lodash');


exports.getAllRooms = function (req, res) {
  log(req._user);
  Room.find({}, function (err, rooms) {
    if (err) {
      return res.status(500).json({
        message: 'Something went wrong while getting Rooms',
        success: false,
        data: err
      });
    }
    log(rooms);
    var minDate = _.minBy(rooms, function (o) {
      return o.updatedAt;
    });

    log(minDate);
    res.status(200).json({
      message: 'Rooms successfully get',
      success: true,
      data: minDate
    });
  });
};

exports.getRoom = function (req, res) {
  Room.findOne({
      members: {$in: [mongoose.Types.ObjectId(req._user._id), mongoose.Types.ObjectId(req.params.receiverId)]}
    },
    function (err, room) {
      if (err) {
        return res.status(500).json({
          message: 'Something went wrong while getting user',
          success: false,
          data: err
        });
      }
      if (room == null) {
        var room = new Room({});
        console.log(room);
        room.members.push(req._user._id, req.params.receiverId);
        room.save({}, function (err, newRoom) {
          if (err) {
            return res.status(500).json({
              message: 'Something went wrong while getting Room',
              success: false,
              data: null
            });
          }
          return res.status(200).json({
            message: 'Room Successfully created',
            success: false,
            data: newRoom
          });
        })
      }
      else {
        res.status(200).json({
          message: 'Room Found',
          success: false,
          data: room
        });
      }
    });

};

exports.newMessage = function (req, res) {
  //return res.send('ok');
  //log(req.params.roomId);
  //log(req.body.userid);
  // log(req.body.hootid);

  Room.findById({_id: req.params.roomId},function (err, room) {
      if (err) {
        return res.status(500).json({
          message: 'Something went wrong while getting user',
          success: false,
          data: null
        });
      }
      log(room.messages);
    //  log(room.messages[room.messages.length - 1]);
     // log(room.messages[room.messages.length - 1].user);

      if (room.messages.length > 0 && room.messages[room.messages.length - 1].user == req._user._id ) {
        return res.status(500).json({
          message: 'You cannot send more hoot until you get a reply',
          success: false,
          data: null

        })
      }
      if (room.messages.length == 0) {
        var msg = {
          user: req.body.userid,//Recipient user id
          hoot: req.body.hootid
        };
        room.messages.push(msg);
        delete req.body.userid;
        delete req.body.hoot;
      }
      hoot.saveHoot(req.body, req._user._id, 1).then(function (hootData) {
        //log(hootData);
        //  log(hootData.data._id);

        var msg = {
          user: mongoose.Types.ObjectId(req._user._id),//My user id
          hoot: mongoose.Types.ObjectId(hootData.data._id)
        };
        log(msg);
        room.messages.push(msg);
        room.save(function (err, newRoom) {
          if (err) {
            return res.status(500).json({
              message: 'Something went wrong while saving new message',
              success: false,
              data: null
            });
          }
          var message = newRoom.messages[newRoom.messages.length - 1];
          res.status(200).json({
            message: 'Message Added',
            success: true,
            data: message
          });

        })
      }, function (err) {
        // log(err);
      }, function (notify) {
        ///  log(notify)
      });
      // res.json({
      //   message: 'Uploading Hoot',
      //   data: null,
      //   success: true
      // });


    });
};
exports.getAllMessages = function (req, res) {
  Room.findById({_id: req.params.roomId},
    function (err, room) {
      if (err) {
        return res.status(500).json({
          message: 'Something went wrong while getting Hoots',
          success: false,
          data: err
        });
      }
      res.status(200).json({
        message: 'All Hoots Successfully get',
        success: true,
        data: room
      });
    })
};