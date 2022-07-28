const AWS = require('aws-sdk'); //npm install aws-sdk


//function to send OTP using AWS-SNS
exports.sendOTP = async (params) => {
  console.log("OTP");
  return new AWS.SNS({ apiVersion: '2010–03–31' }).publish(params).promise()
    .then(message => {
      console.log("OTP SEND SUCCESS");
    })
    .catch(err => {
      console.log("Error " + err)
      return err;
    });
};