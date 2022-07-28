const mongoose = require('mongoose');
const APIError = require('../errors/api-error');
const { omitBy, isNil } = require('lodash');

/**
* User Roles
*/
const roles = ['user', 'admin'];

/**
 * Vehicle Loan Application Advice Schema
 * @private
 */
const vehicleLoanApplicationAdviceSchema = new mongoose.Schema({
    coeExpiryDate: { type: Date, trim: true },
    approvedLoanAmount: { type: Number, trim: true },
    approvedTenure: { type: String, trim: true },
    processingFee: { type: Number, trim: true },
    repaymentMode: { type: String, trim: true, },
    hirePurchaseType: { type: String, trim: true, },
    vehicleType: { type: String, trim: true },
    status: { type: String, trim: true, },
    loan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
});

/**
 * Methods
 */
vehicleLoanApplicationAdviceSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'coeExpiryDate', 'approvedLoanAmount', 'approvedTenure', 'processingFee', 'repaymentMode', 'hirePurchaseType', 'vehicleType', 'status', 'loan', 'createdAt'];
  
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    },
  });

/**
 * Statics
 */
vehicleLoanApplicationAdviceSchema.statics = {

  roles,

  /**
   * List Vehicle Loan Application Advice  in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of vehicleLoanApplicationAdvice to be skipped.
   * @param {number} limit - Limit number of vehicleLoanApplicationAdvice to be returned.
   * @returns {Promise<VehicleLoanApplicationAdvice[]>}
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
   * Get vehicleLoanApplicationAdvice
   *
   * @param {ObjectId} id - The objectId of vehicleLoanApplicationAdvice.
   * @returns {Promise<VehicleLoanApplicationAdvice, APIError>}
   */
  async get(id) {
    let vehicleLoanApplicationAdvice;

    if (mongoose.Types.ObjectId.isValid(id)) {
        vehicleLoanApplicationAdvice = await this.findById(id).exec();
    }
    if (vehicleLoanApplicationAdvice) {
      return vehicleLoanApplicationAdvice;
    }

    throw new APIError({
      message: 'VehicleLoanApplicationAdvice does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
     * Update vehicleLoanApplicationAdvice
     *
     * @param {ObjectId} _id - The objectId of vehicleLoanApplicationAdvice.
     */

  async update(vehicleLoanApplicationAdviceData) {
    let updateVehicleLoanApplicationAdvice;
    const _id = vehicleLoanApplicationAdviceData.id;
    if (mongoose.Types.ObjectId.isValid(_id)) {
        updateVehicleLoanApplicationAdvice = await this.findByIdAndUpdate({ _id }, vehicleLoanApplicationAdviceData,
        (err, result) => {
          if (err) return next(err);
        });
    }
    return updateVehicleLoanApplicationAdvice;
  },

};

/**
 * @typedef VehicleLoanApplicationAdvice
 */
module.exports = mongoose.model('VehicleLoanApplicationAdvice', vehicleLoanApplicationAdviceSchema);
