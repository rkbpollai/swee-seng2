const Joi = require('joi');
const Loan = require('../models/loan.model');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/loans
  listLoans: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      role: Joi.string().valid(Loan.roles),
    },
  },

  // GET /v1/loans:id
  getLoans: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // GET /v1/loans/dashboard
  getDashboardLoans: {
    body: {
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
    },
  },

  // POST /v1/loans
  createLoan: {
    body: {
      step: Joi.number().min(1).max(7).required(),
      role: Joi.string().valid(User.roles),
    },
  },

  // POST /v1/loans/calculator
  calculateMonthlyRepayment: {
    body: {
      amount: Joi.number().required(),
      interestRate: Joi.number().required(),
      duration: Joi.number().required()
    },
  },

  // PUT /v1/loans:id
  updateLoan: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PUT /v1/loans:id
  updateLoanByAdmin: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // @TODO: Need to add valiation. Currently using form
  // POST /v1/loans/upload/:id
  // upload: {
  //   body: {
  //     file: Joi.object().required(),
  //     name: Joi.string().required(),
  //     type: Joi.string().required(),
  //     role: Joi.string().valid(User.roles),
  //   },
  //   params: {
  //     id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  //   },
  // },

};