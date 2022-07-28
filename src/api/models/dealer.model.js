const mongoose = require('mongoose');
const APIError = require('../errors/api-error');
const AutoIncrement = require('mongoose-sequence') (mongoose);

/**
* User Roles
*/
const roles = ['user', 'admin'];

/**
* Dealer Status
*/
const status = ['Active', 'Inactive'];

/**
 * Dealer Schema
 * @private
 */
const dealerSchema = new mongoose.Schema({
  dealerName: { type: String, maxlength: 128, index: true, trim: true },  
  icNo: { type: String, trim: true, },
  companyRegNo: { type: String, trim: true, },
  dealerCode: { type: String, trim: true, },
  phone: { type: String, maxlength: 128, trim: true, },
  address: { type: String, trim: true },
  email: { type: String, maxlength: 128, lowercase: true, trim: true, },
  status: { type: String, enum: status, default: 'Active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serialNumber: { type: Number, trim: true},
}, {
  timestamps: true,
});

dealerSchema.plugin(AutoIncrement, { id: 'serialNumber_seqDealer', inc_field: 'serialNumber', start_seq: 1001 });
/**
 * Methods
 */
dealerSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'dealerName', 'icNo', 'companyRegNo', 'dealerCode', 'phone', 'address', 'email', 'status', 'user', 'serialNumber', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
dealerSchema.statics = {

  roles,

  /**
   * List dealers in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of dealers to be skipped.
   * @param {number} limit - Limit number of dealers to be returned.
   * @returns {Promise<Dealer[]>}
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
   * Get dealer
   *
   * @param {ObjectId} id - The objectId of dealer.
   * @returns {Promise<Dealer, APIError>}
   */
  async get(id) {
    let dealer;

    if (mongoose.Types.ObjectId.isValid(id)) {
      dealer = await this.findById(id).exec();
    }
    if (dealer) {
      return dealer;
    }

    throw new APIError({
      message: 'Dealer does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
  
/**
   * Update dealer
   *
   * @param {ObjectId} _id - The objectId of dealer.
   */

  async update(dealerData) {
    let updateDealer;
   const _id = dealerData.id;
   if (mongoose.Types.ObjectId.isValid(_id)) {
      updateDealer = await this.findByIdAndUpdate({_id}, dealerData,
       (err, result) => {
         if (err) return next(err);
       });
   }
     return updateDealer;
 },
  
};

/**
 * @typedef Dealer
 */
module.exports = mongoose.model('Dealer', dealerSchema);
