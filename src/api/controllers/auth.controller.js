const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const PasswordResetToken = require('../models/passwordResetToken.model');
const { jwtExpirationInterval } = require('../../config/vars');
const APIError = require('../errors/api-error');
const emailProvider = require('../services/emails/emailProvider');
const smsProvider = require('../services/sms/smsProvider');

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = "Bearer";
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, "minutes");
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

//function to generate random number
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

exports.register = async (req, res, next) => {
  try {
    // const otp = '1234560';
    var OTP = generateRandomNumber(1000, 9999);
    var params = {
      Message: "Your one time code to login to SweeSeng is: " + OTP , /* required */
      PhoneNumber: req.body.phone,
    };

    req.body.password = OTP;
    const userData = omit(req.body, 'role');
    let user = await User.getUser(req.body.phone);
    if (user) {
      user = await User.updateUser(req.body);
    } else {
      user = await new User(userData).save();
    }
    smsProvider.sendOTP(params);
    //  const userTransformed = user.transform();
    // const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({});
  } catch (error) {
    return next(User.checkDuplicatePhone(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { phone, email, refreshToken } = req.body;
    var response;
    if (phone) {
      const refreshObject = await RefreshToken.findOneAndRemove({
        userPhone: phone,
        token: refreshToken,
      });
      const { user, accessToken } = await User.findAndGenerateToken({
        phone,
        refreshObject,
      });
      response = generateTokenResponse(user, accessToken);
    } else if (email) {
      const refreshObject = await RefreshToken.findOneAndRemove({
        userEmail: email,
        token: refreshToken,
      });
      const { user, accessToken } = await User.findAndGenerateToken({
        email,
        refreshObject,
      });
      response = generateTokenResponse(user, accessToken);
    } else {
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: "phone/email required",
      });
    }
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.sendPasswordReset = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone }).exec();

    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json("success");
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: "No account found with that email",
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { phone, password, resetToken } = req.body;
    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userPhone: phone,
      resetToken,
    });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!resetTokenObject) {
      err.message = "Cannot find matching reset token";
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      err.message = "Reset token is expired";
      throw new APIError(err);
    }

    const user = await User.findOne({
      phone: resetTokenObject.userPhone,
    }).exec();
    user.password = password;
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);

    res.status(httpStatus.OK);
    return res.json("Password Updated");
  } catch (error) {
    return next(error);
  }
};
