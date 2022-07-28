const mongoose = require('mongoose');
const { omitBy, isNil } = require('lodash');

/**
* User Roles
*/
const roles = ['user', 'admin'];
const type = ['web', 'mobile'];

/**
 * Notification Schema
 * @private
 */
const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    trim: true,
  },
  isRead: {
    type: Boolean,
    trim: true,
    default: 'false'
  },
  type: { type: String, enum: type, default: 'web' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
});

/**
 * Methods
 */
notificationSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'message', 'user', 'isRead', 'type', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
notificationSchema.statics = {

  roles,

  /**
   * List notifications in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of notifications to be skipped.
   * @param {number} limit - Limit number of notifications to be returned.
   * @returns {Promise<Notification[]>}
   */
  list({
    page = 1, perPage = 30,
  }) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
  /**
   * List notifications in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of notifications to be skipped.
   * @param {number} limit - Limit number of notifications to be returned.
   * @returns {Promise<Notification[]>}
   */
  Notificationlist({
    page = 1, perPage = 30, type
  }) {
    const options = omitBy({ type }, isNil);
    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * List notifications in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of notifications to be skipped.
   * @param {number} limit - Limit number of notifications to be returned.
   * @param {ObjectId} id - Limit number of notifications to be returned.
   * @returns {Promise<Notification[]>}
   */
  list({
    page = 1, perPage = 30,
  }, id) {
    return this.find({ id })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

   /**
     * Update notification
     *
     * @param {ObjectId} _id - The objectId of notification.
     */

      update(notificationData) {
      let updateNotification;
      const _id = notificationData.id;
      if (mongoose.Types.ObjectId.isValid(_id)) {
        updateNotification = this.findByIdAndUpdate({ _id }, notificationData,
          (err, result) => {
            if (err) return next(err);
          });
      }
      return updateNotification;
    },

};

/**
 * @typedef Notification
 */
module.exports = mongoose.model('Notification', notificationSchema);
