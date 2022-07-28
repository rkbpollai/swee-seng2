const Joi = require('joi');
const Dealer = require('../models/dealer.model');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/dealers
  listDealers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      role: Joi.string().valid(Dealer.roles),
    }
  },

  // GET /v1/dealers
  getDealers: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // GET /v1/dealers
  updateDealer: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/dealers
  createDealer: {
    body: {
      role: Joi.string().valid(User.roles),
    },
  },
};
