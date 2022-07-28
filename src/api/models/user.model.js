const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
const AutoIncrement = require('mongoose-sequence') (mongoose);

/**
* User Roles
*/
const roles = ['user', 'customer', 'admin'];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    maxlength: 320,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 128,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  autoNumber: { 
    type: Number, 
    trim: true 
  },
  email: { 
    type: String, 
    maxlength: 128, 
    lowercase: true, 
    trim: true, 
  },
  gender: {
    type: String,
    trim: true,
  },
  status: { 
    type: String, 
    trim: true 
  },
  services: {
    facebook: String,
    google: String,
  },
  role: {
    type: String,
    enum: roles,
    default: 'customer',
  },
  picture: {
    type: String,
    trim: true,
  },
  serialNumber: { type: Number, trim: true},
}, {
  timestamps: true,
});

userSchema.plugin(AutoIncrement, { id: 'serialNumber_seqUser', inc_field: 'serialNumber', start_seq: 1001 });
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
// userSchema.pre('save', async function save(next) {
//   try {
//     if (!this.isModified('password')) return next();

//     const rounds = env === 'test' ? 1 : 10;

//     const hash = await bcrypt.hash(this.password, rounds);
//     this.password = hash;

//     return next();
//   } catch (error) {
//     return next(error);
//   }
// });

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'phone', 'picture', 'role', 'autoNumber', 'email', 'gender', 'status', 'serialNumber', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const payload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(payload, jwtSecret);
  },

  async passwordMatches(password) {
    // return bcrypt.compare(password, this.password);
    return password === this.password;
  },
});

/**
 * Statics
 */
userSchema.statics = {

  roles,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }

    throw new APIError({
      message: 'User does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  // find user by phone

  async getUser(phone) {
    if (!phone) throw new APIError({ message: 'An phone is required to generate a token' });
    const user = await this.findOne({ phone }).exec();
    return user;
  },

  // Update User Existing User

  async updateUser(userData) {
    let updateuser;

    if (userData) {
      const { phone } = userData;
      updateuser = await this.updateOne({ phone }, { password: userData.password },
        (err, updateuser) => {
          if (err) return next(err);
        });
    }
    return updateuser;
  },

  /**
   * Find user by phone and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options) {
    const { phone, email, password, refreshObject } = options;
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    if (!phone && !email) throw new APIError({ message: 'An phone or email is required to generate a token' });

    let user;
    if (phone) {
      user = await this.findOne({ phone }).exec();
      if (user.role !== 'customer') {
        err.message = 'Incorrect role';
        throw new APIError(err);
      }
    } else {
      const webUserRoles = ['admin', 'user'];
      user = await this.findOne({ email }).exec();
      if (!webUserRoles.includes(user.role)) {
        err.message = 'Incorrect role';
        throw new APIError(err);
      }
    }

    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect phone/email or password';
    } else if (refreshObject && ((refreshObject.userPhone && refreshObject.userPhone === phone) || (refreshObject.userPhone && refreshObject.userEmail === email))) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect phone/email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    page = 1, perPage = 30, name, phone, role,
  }) {
    const options = omitBy({ name, phone, role, role: { $ne: 'customer' } }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicatePhone(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'phone',
          location: 'body',
          messages: ['"phone" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },

  async oAuthLogin({
    service, id, phone, name, picture,
  }) {
    const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { phone }] });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      if (!user.picture) user.picture = picture;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, phone, password, name, picture,
    });
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
