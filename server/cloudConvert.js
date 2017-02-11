var Q = require('q');
var config = require('../config/config');
var cloudconvert = new (require('cloudconvert'))(config.cloudConvertAPIKEY);
var AWS = require('aws-sdk');
var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;


exports.convertAudio = function (data,name) {
  return Q.promise(function (resolve,reject) {
    cloudconvert.createProcess({inputformat: 'amr', outputformat: 'wav'}, function (err, process) {
      if (err) {
        log('CloudConvert Process creation failed: ' + err);
      } else {
        // start the process. see https://cloudconvert.com/apidoc#create
        process.start({
          input: 'base64',
          file: data.audio,
          filename: name + '.amr',
          converteroptions: {
            audio_bitrate: "128",
            audio_frequency: "44100",
            audio_qscale: -1,
            audio_codec:"PCM_S16LE"
          },
          output: {
            s3: {
              accesskeyid: config.s3.accesskeyid,
              secretaccesskey: config.s3.secretaccesskey,
              bucket: config.s3.bucket
            }
          },
          outputformat: "wav"
        }, function (err, process) {
          if (err) {
            log('CloudConvert Process start failed: ' + err);
          }
          process.wait(function (err, process) {
            if (err) {
              log('CloudConvert Process start failed: ' + err);
              reject(err);
            } else {
              resolve(process);
            }
          });

        });
      }

    });
  })
  
};