const httpStatus = require('http-status');
const { omit } = require('lodash');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');
const APIError = require('../errors/api-error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const currentUser = req.user;
    if(currentUser) req.body.user = currentUser._id;
    const notification = new Notification(req.body);
    const savedUser = await notification.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    throw new APIError(error);
  }
};

/**
 * Get User Notification list
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let userNotifications = await Notification.list(req.user._id);
    const transformedNotifications = userNotifications.map((notification) => notification.transform());
    return res.json(transformedNotifications);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const notifications = await Notification.list(req.query);
    const transformedUsers = notifications.map((notification) => notification.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Notification list
 * @public
 */
exports.getNotifications = async (req, res, next) => {
  try {
    req.query.type = req.params.type;
    const notifications = await Notification.Notificationlist(req.query);
    const transformedUsers = notifications.map((notification) => notification.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing Notification
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    req.body.id = req.params.id;
    let updatedNotificationData = await Notification.update(req.body);
    return res.json(updatedNotificationData.transform());
} catch (error) {
  return next(error);
}
};
