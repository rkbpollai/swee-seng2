const httpStatus = require('http-status');
const { omit } = require('lodash');
const LoanCategory = require('../models/loanCategory.model');
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
 * Create new loan category
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const loanCategory = new LoanCategory(req.body);
    const savedLoanCategory = await loanCategory.save();
    res.status(httpStatus.CREATED);
    res.json(savedLoanCategory.transform());
  } catch (error) {
    throw new APIError(error);
  }
};

/**
 * Get loan category list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const loanCategories = await LoanCategory.list(req.query);
    const transformedLoanCategory = loanCategories.map((loanCategory) => loanCategory.transform());
    res.json(transformedLoanCategory);
  } catch (error) {
    next(error);
  }
};

/**
 * Get loan category
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const loanCategoryId = "625ea500eaaae111df0ec026";
    let loanCategoryData = await LoanCategory.get(loanCategoryId);
    const transformedLoanCategory = loanCategoryData.transform();
    return res.json(transformedLoanCategory);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update existing loan category controller
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    req.body.id = req.params.id;
    let updatedLoanCategoryData = await LoanCategory.update(req.body);
    const transformedupdatedData = updatedLoanCategoryData.transform();
    return res.json(transformedupdatedData);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete loan category
 * @public
 */
 exports.remove = async (req, res, next) => {
  const id = req.params.id;
  var loanCategory = await LoanCategory.get(id);
  loanCategory.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};