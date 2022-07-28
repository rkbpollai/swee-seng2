const Joi = require('joi');
const Guarantor = require('../models/guarantor.model');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/guarantors
  listGuarantors: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      role: Joi.string().valid(Guarantor.roles),
    }
  },

  // GET /v1/guarantors
  getGuarantors: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // GET /v1/guarantors
  updateGuarantor: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/guarantors
  createGuarantor: {
    body: {
      role: Joi.string().valid(User.roles),
    },
  },
};
