const Joi = require('joi');
const LoanCategory = require('../models/loanCategory.model');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/loan/category
  listLoanCategory: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      role: Joi.string().valid(LoanCategory.roles),
    },
  },

  // GET /v1/loan/category
  updateLoanCategory: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/loan/category
  createLoanCategory: {
    body: {
      type: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      role: Joi.string().valid(User.roles),
    },
  },
};
