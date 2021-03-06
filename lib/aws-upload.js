'use strict';

require('dotenv').load();
var util = require('util');
var crypto = require('crypto');
var fs = require('fs');
var AWS = require('aws-sdk');
var getFileType = require('file-type');

var Image = require('../models/image.js');

var awsS3 = new AWS.S3();

var awsUpload = function(buffer, caption, callback) {
  var fileType = getFileType(buffer);

  if (!fileType) {
    fileType = {
      ext: 'bin',
      mime: 'application/octet-stream'
    };
  }

  var key = util.format('%s/%s.%s',
    (new Date()).toISOString().split('T')[0],
    crypto.pseudoRandomBytes(16).toString('hex'),
    fileType.ext);

  var params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: fileType.mime,
    Body: buffer
  };

  awsS3.upload(params, function(err, data) {
    if (err) {
      callback(err);
      return;
    }
    Image.create({
      url: data.Location,
      mime: fileType.mime,
      caption: caption
    }, function(err, image) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, image);
    });
  });

};

module.exports = awsUpload;
