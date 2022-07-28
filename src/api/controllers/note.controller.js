const httpStatus = require('http-status');
const Note = require('../models/note.model');
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
 * Create new note
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (currentUser) req.body.createdBy = currentUser._id;
    const note = new Note(req.body);
    const savedNote = await note.save();
    res.status(httpStatus.CREATED);
    res.json(savedNote.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Get note
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const note = await Note.get(req.params.id);
    return res.json(note.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Get notes list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const notes = await Note.list(req.query);
    const transformed = notes.map((note) => note.transform());
    res.json(transformed);
  } catch (error) {
    next(error);
  }
};

/**
 * Get loan notes list
 * @public
 */
exports.getLoanNotes = async (req, res, next) => {
  try {
    req.query.loan = req.params.id;
    const notes = await Note.list(req.query);
    const transformed = notes.map((note) => note.transform());
    res.json(transformed);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing note
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    req.body.id = req.params.id;
    const updatedNote = await Note.update(req.body);
    return res.json(updatedNote.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete note
 * @public
 */
exports.remove = async (req, res, next) => {
  const id = req.params.id;
  var note = await Note.get(id);
  note.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};