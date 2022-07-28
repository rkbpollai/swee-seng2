const mongoose = require('mongoose');
const APIError = require('../errors/api-error');
const { omitBy, isNil } = require('lodash');

/**
* User Roles
*/
const roles = ['user', 'admin'];

/**
 * Guarantor Schema
 * @private
 */
const guarantorSchema = new mongoose.Schema({
  name: { type: String, maxlength: 128, index: true, trim: true },
  nricNo: { type: String, trim: true, },
  phone: { type: String, maxlength: 128, trim: true, },
  address: { type: String, trim: true },
  dateOfBirth: { type: Date, trim: true },
  employer: { type: String, trim: true },
  email: { type: String, maxlength: 128, lowercase: true, trim: true, },
  loan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
});

/**
 * Methods
 */
guarantorSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'nricNo', 'phone', 'address', 'dateOfBirth', 'employer', 'email', 'loan', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
guarantorSchema.statics = {

  roles,

  /**
   * List guarantor in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of dealers to be skipped.
   * @param {number} limit - Limit number of dealers to be returned.
   * @returns {Promise<Dealer[]>}
   */
  list({
    page = 1, perPage = 30, loan
  }) {
    const options = omitBy({ loan }, isNil);
    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Get guarantor
   *
   * @param {ObjectId} id - The objectId of guarantor.
   * @returns {Promise<Guarantor, APIError>}
   */
  async get(id) {
    let guarantor;

    if (mongoose.Types.ObjectId.isValid(id)) {
      guarantor = await this.findById(id).exec();
    }
    if (guarantor) {
      return guarantor;
    }

    throw new APIError({
      message: 'Guarantor does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
     * Update guarantor
     *
     * @param {ObjectId} _id - The objectId of guarantor.
     */

  async update(guarantorData) {
    let updateGuarantor;
    const _id = guarantorData.id;
    if (mongoose.Types.ObjectId.isValid(_id)) {
      updateGuarantor = await this.findByIdAndUpdate({ _id }, guarantorData,
        (err, result) => {
          if (err) return next(err);
        });
    }
    return updateGuarantor;
  },

};

/**
 * @typedef Guarantor
 */
module.exports = mongoose.model('Guarantor', guarantorSchema);
