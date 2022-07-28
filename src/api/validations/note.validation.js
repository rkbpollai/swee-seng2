const Joi = require('joi');
const Note = require('../models/note.model');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/notes
  listNotes: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      role: Joi.string().valid(Note.roles),
    }
  },

  // GET /v1/notes
  getNotes: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // GET /v1/notes
  updateNote: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/notes
  createNote: {
    body: {
      role: Joi.string().valid(User.roles),
    },
  },
};
