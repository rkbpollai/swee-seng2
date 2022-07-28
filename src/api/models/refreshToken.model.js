const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');

/**
 * Refresh Token Schema
 * @private
 */
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userPhone: {
    type: 'String',
    ref: 'User',
  },
  userEmail: {
    type: 'String',
    ref: 'User',
  },
  expires: { type: Date },
});

refreshTokenSchema.statics = {

  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {User} user
   * @returns {RefreshToken}
   */
  generate(user) {
    const userId = user._id;
    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();
    let tokenData;
    if (user.phone && user.email) {
      const userPhone = user.phone;
      const userEmail = user.email;
      tokenData = {
        token, userId, userPhone, userEmail, expires,
      }
    } else if (user.phone) {
      const userPhone = user.phone;
      tokenData = {
        token, userId, userPhone, expires,
      }
    } else {
      const userEmail = user.email;
      tokenData = {
        token, userId, userEmail, expires,
      }
    }

    const tokenObject = new RefreshToken(tokenData);
    tokenObject.save();
    return tokenObject;
  },

};

/**
 * @typedef RefreshToken
 */
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;
