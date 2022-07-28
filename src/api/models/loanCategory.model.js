const mongoose = require('mongoose');

/**
* User Roles
*/
const roles = ['user', 'admin'];

/**
 * Loan Schema
 * @private
 */
const loanCategorySchema = new mongoose.Schema({
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  type: { type: String, trim: true },
  interestRate: { type: Number, trim: true },
}, {
  timestamps: true,
});

/**
 * Methods
 */
loanCategorySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'type', 'title', 'description', 'interestRate', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
loanCategorySchema.statics = {

  roles,

  /**
   * List loan category in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of loan category to be skipped.
   * @param {number} limit - Limit number of loan category to be returned.
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
   * Get loanCategory
   *
   * @param {ObjectId} id - The objectId of loanCategory.
   * @returns {Promise<LoanCategory, APIError>}
   */
  async get(id) {
    let loanCategory;

    if (mongoose.Types.ObjectId.isValid(id)) {
      loanCategory = await this.findById(id).exec();
    }
    if (loanCategory) {
      return loanCategory;
    }

    throw new APIError({
      message: 'Loan Category does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * Update loan category model
   *
   * @param {ObjectId} _id - The objectId of loan category.
   */

  async update(loanCategoryData) {
     let updateLoanCategory;
    const _id = loanCategoryData.id;
    if (mongoose.Types.ObjectId.isValid(_id)) {
      updateLoanCategory = await this.findByIdAndUpdate({_id}, loanCategoryData,
        (err, result) => {
          if (err) return next(err);
        });
    }
      return updateLoanCategory;
  },

};

/**
 * @typedef LoanCategory
 */
module.exports = mongoose.model('LoanCategory', loanCategorySchema);
