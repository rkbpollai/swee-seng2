const mongoose = require('mongoose');
const APIError = require('../errors/api-error');
const { omitBy, isNil } = require('lodash');

/**
* User Roles
*/
const roles = ['user', 'admin'];

/**
 * Note Schema
 * @private
 */
const noteSchema = new mongoose.Schema({
    title: { type: String, trim: true, },
    description: { type: String, trim: true, },
    loan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
});

/**
 * Methods
 */
noteSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'title', 'description', 'loan', 'createdAt'];
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    },
  });

/**
 * Statics
 */
noteSchema.statics = {

  roles,

  /**
   * List notes in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of notes to be skipped.
   * @param {number} limit - Limit number of notes to be returned.
   * @returns {Promise<Note[]>}
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
   * Get notes
   *
   * @param {ObjectId} id - The objectId of note.
   * @returns {Promise<Note, APIError>}
   */
  async get(id) {
    let note;

    if (mongoose.Types.ObjectId.isValid(id)) {
        note = await this.findById(id).exec();
    }
    if (note) {
      return note;
    }

    throw new APIError({
      message: 'Note does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
     * Update note
     *
     * @param {ObjectId} _id - The objectId of note.
     */

  async update(noteData) {
    let updatenote;
    const _id = noteData.id;
    if (mongoose.Types.ObjectId.isValid(_id)) {
        updatenote = await this.findByIdAndUpdate({ _id }, noteData,
        (err, result) => {
          if (err) return next(err);
        });
    }
    return updatenote;
  },

};

/**
 * @typedef Note
 */
module.exports = mongoose.model('Note', noteSchema);
