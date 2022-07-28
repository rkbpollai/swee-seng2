const Joi = require('joi');

module.exports = {

  // POST /v1/auth/register
  register: {
    body: {
      phone: Joi.string()
        .required(),
    },
  },

  // POST /v1/auth/login
  login: {
    body: {
      phone: Joi.string(),
      password: Joi.string()
        .required()
        .max(128),
    },
  },

  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: {
    body: {
      access_token: Joi.string().required(),
    },
  },

  // POST /v1/auth/refresh
  refresh: {
    body: {
      phone: Joi.string(),
      refreshToken: Joi.string().required(),
    },
  },

  // POST /v1/auth/refresh
  sendPasswordReset: {
    body: {
      phone: Joi.string()
        .required(),
    },
  },

  // POST /v1/auth/password-reset
  passwordReset: {
    body: {
      phone: Joi.string()
        .required(),
      password: Joi.string()
        .required()
        .min(6)
        .max(128),
      resetToken: Joi.string().required(),
    },
  },
};
