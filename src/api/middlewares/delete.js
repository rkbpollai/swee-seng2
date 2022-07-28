const util = require("util");
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
var s3 = new AWS.S3({ params: {Bucket: process.env.AWS_BUCKET_NAME} });

let deleteFile = (key) => {
  var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: key };
  s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack);  // error
    else console.log(data);                // deleted
  });
}

let deleteFileMiddleware = util.promisify(deleteFile);

module.exports = deleteFileMiddleware;