const Joi = require('joi');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      phone: Joi.string(),
      role: Joi.string().valid(User.roles),
    },
  },

  // POST /v1/users
  // Add .required() for password
  createUser: {
    body: {
      phone: Joi.string(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
      email: Joi.string().max(320),
      role: Joi.string().valid(User.roles),
    },
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      phone: Joi.string().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      phone: Joi.string(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/users/customer/:userId
  updateUserByCustomer: {
    body: {
      name: Joi.string().max(128),
      email: Joi.string().max(128),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

};
