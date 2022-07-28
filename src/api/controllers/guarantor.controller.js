const httpStatus = require('http-status');
const Guarantor = require('../models/guarantor.model');
const User = require('../models/user.model');
const Loan = require('../models/loan.model');

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
 * Create new guarantor
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (currentUser) req.body.createdBy = currentUser._id;
    const guarantor = new Guarantor(req.body);
    const savedGuarantor = await guarantor.save();
    res.status(httpStatus.CREATED);
    res.json(savedGuarantor.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Get guarantor
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const guarantor = await Guarantor.get(req.params.id);
    return res.json(guarantor.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Get guarantor list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const guarantors = await Guarantor.list(req.query);
    const transformed = guarantors.map((guarantor) => guarantor.transform());
    res.json(transformed);
  } catch (error) {
    next(error);
  }
};

/**
 * Get loan guarantors list
 * @public
 */
exports.getLoanGuarantors = async (req, res, next) => {
  try {
    req.query.loan = req.params.id;
    const guarantors = await Guarantor.list(req.query);
    const transformed = guarantors.map((guarantor) => guarantor.transform());
    res.json(transformed);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing guarantor
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    req.body.id = req.params.id;
    const updatedGuarantor = await Guarantor.update(req.body);
    return res.json(updatedGuarantor.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete guarantor
 * @public
 */
exports.remove = async (req, res, next) => {
  const id = req.params.id;
  var guarantor = await Guarantor.get(id);
  guarantor.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};