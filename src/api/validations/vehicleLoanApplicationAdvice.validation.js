const Joi = require('joi');
const VehicleLoanApplicationAdvice = require('../models/vehicleLoanApplicationAdvice.model');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/vehicleLoanApplicationAdvices
  listVehicleLoanApplicationAdvices: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      role: Joi.string().valid(VehicleLoanApplicationAdvice.roles),
    }
  },

  // GET /v1/vehicleLoanApplicationAdvices
  getVehicleLoanApplicationAdvices: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // GET /v1/vehicleLoanApplicationAdvices
  updateVehicleLoanApplicationAdvice: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/vehicleLoanApplicationAdvices
  createVehicleLoanApplicationAdvice: {
    body: {
      role: Joi.string().valid(User.roles),
    },
  },
};
