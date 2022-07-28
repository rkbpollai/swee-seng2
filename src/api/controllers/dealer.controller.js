const httpStatus = require('http-status');
const Dealer = require('../models/dealer.model');
const User = require('../models/user.model');

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
 * Create new dealer
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (currentUser) req.body.createdBy = currentUser._id;
    const dealer = new Dealer(req.body);
    const savedDealer = await dealer.save();
    res.status(httpStatus.CREATED);
    res.json(savedDealer.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Dealer
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let dealerData = await Dealer.get(req.params.id);
    const transformedDealer = dealerData.transform();
    return res.json(transformedDealer);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get dealer list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const dealers = await Dealer.list(req.query);
    const transformedDealers = dealers.map((dealer) => dealer.transform());
    res.json(transformedDealers);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing Dealer
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    req.body.id = req.params.id;
    let updatedDealerData = await Dealer.update(req.body);
    const transformedupdatedDealerData = updatedDealerData.transform();
    return res.json(transformedupdatedDealerData);
} catch (error) {
  return next(error);
}
};

/**
 * Delete Dealer
 * @public
 */
exports.remove = async (req, res, next) => {
  const id = req.params.id;
  var dealer = await Dealer.get(id);
  dealer.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};