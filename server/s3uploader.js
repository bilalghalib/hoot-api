var Q = require('q');
var AWS = require('aws-sdk');
var config = require('../config/config');
var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;

AWS.config.update({
  accessKeyId: config.s3.accesskeyid,
  secretAccessKey: config.s3.secretaccesskey
});
var s3 = new AWS.S3();


exports.uploadBase64 = function (data,name) {

  return  Q.Promise(function(resolve,reject){
    var buf = new Buffer(data.audio.replace(/^data:audio\/\w+;base64,/, ""),'base64');
    var bucketName = config.s3.bucket;
    var params = {
      Bucket:  bucketName,
      Key: name + ".wav",
      Body: buf,
      ContentType: 'audio/' + data.type,
      ACL: 'public-read'
    };
    s3.upload(params, function (err, data) {
      if (err){
        log(err);
        reject(err);
      }else{
        resolve(data);
        // TODO: save data to mongo
      }

    });
  });

  //log('hit');

};
