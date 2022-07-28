const httpStatus = require('http-status');
const VehicleLoanApplicationAdvice = require('../models/vehicleLoanApplicationAdvice.model');
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
 * Create new vehicleLoanApplicationAdvice
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (currentUser) req.body.createdBy = currentUser._id;
    const vehicleLoanApplicationAdvice = new VehicleLoanApplicationAdvice(req.body);
    const savedVehicleLoanApplicationAdvice = await vehicleLoanApplicationAdvice.save();
    res.status(httpStatus.CREATED);
    res.json(savedVehicleLoanApplicationAdvice.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Get vehicleLoanApplicationAdvice
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const vehicleLoanApplicationAdvice = await VehicleLoanApplicationAdvice.get(req.params.id);
    return res.json(vehicleLoanApplicationAdvice.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Get vehicleLoanApplicationAdvice list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const vehicleLoanApplicationAdvices = await VehicleLoanApplicationAdvice.list(req.query);
    const transformed = vehicleLoanApplicationAdvices.map((vehicleLoanApplicationAdvice) => vehicleLoanApplicationAdvice.transform());
    res.json(transformed);
  } catch (error) {
    next(error);
  }
};

/**
 * Get loan vehicleLoanApplicationAdvices list
 * @public
 */
exports.getLoanVehicleLoanApplicationAdvices = async (req, res, next) => {
  try {
    req.query.loan = req.params.id;
    const vehicleLoanApplicationAdvices = await VehicleLoanApplicationAdvice.list(req.query);
    const transformed = vehicleLoanApplicationAdvices.map((vehicleLoanApplicationAdvice) => vehicleLoanApplicationAdvice.transform());
    res.json(transformed);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing vehicleLoanApplicationAdvice
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    req.body.id = req.params.id;
    const updatedVehicleLoanApplicationAdvice = await VehicleLoanApplicationAdvice.update(req.body);
    return res.json(updatedVehicleLoanApplicationAdvice.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete vehicleLoanApplicationAdvice
 * @public
 */
exports.remove = async (req, res, next) => {
  const id = req.params.id;
  var vehicleLoanApplicationAdvice = await VehicleLoanApplicationAdvice.get(id);
  vehicleLoanApplicationAdvice.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};