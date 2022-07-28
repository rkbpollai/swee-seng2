const Joi = require('joi');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/notifications
  listNotifications: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      role: Joi.string().valid(Notification.roles),
    },
  },

  // PUT /v1/notifications
  updateNotification: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // GET /v1/notifications
  getNotifications: {
    params: {
      type: Joi.string().required(),
    },
  },

  // POST /v1/notifications
  createNotification: {
    body: {
      message: Joi.string().required(),
      role: Joi.string().valid(User.roles),
    },
  },
};
