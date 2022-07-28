const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/loanCategory.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listLoanCategory, createLoanCategory, updateLoanCategory
} = require('../../validations/loanCategory.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/loan/category Get loan category
   * @apiDescription Get a loan category
   * @apiVersion 1.0.0
   * @apiName LoanCategory
   * @apiGroup LoanCategory
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   Loan Category's access token
   *
   * @apiSuccess {String}   id           id of loan category.
   * @apiSuccess {String}   title        title of loan category.
   * @apiSuccess {String}   description  description of loan category.
   * @apiSuccess {String}   type         type of loan category.
   * @apiSuccess {Number}   interestRate interestRate of loan category.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated dealers can access the
   * data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(), controller.get)
  /**
   * @api {post} v1/loan/category Create loan category
   * @apiDescription Create a new loan category
   * @apiVersion 1.0.0
   * @apiName CreateLoanCategory
   * @apiGroup LoanCategory
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   LoanCategory's access token
   *
   * @apiParam  {String}             type           LoanCategory's type
   * @apiParam  {String}             title          LoanCategory's title
   * @apiParam  {String}             description    LoanCategory's description
   * @apiParam  {String=user,admin}  [role]         LoanCategory's role
   *
   * @apiSuccess (Created 201) {String}  id             LoanCategory's id
   * @apiSuccess (Created 201) {String}  type           LoanCategory's type
   * @apiSuccess (Created 201) {String}  title          LoanCategory's title
   * @apiSuccess (Created 201) {String}  description    LoanCategory's description
   * @apiSuccess (Created 201) {Date}    createdAt      Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(), validate(createLoanCategory), controller.create);

  router
  .route('/list')
   /**
   * @api {get} v1/loan/category/list List loan category
   * @apiDescription Get a list of loan category
   * @apiVersion 1.0.0
   * @apiName ListLoanCategory
   * @apiGroup LoanCategory
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   LoanCategory's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  LoanCategory per page
   * @apiParam  {String=user,admin}  [role]       LoanCategory's role
   *
   * @apiSuccess {Object[]} loanCategory List of loan category.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated loan category can access the
   * data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
    .get(authorize(), validate(listLoanCategory), controller.list);

  router
    .route('/:id')

    /**
   * @api {patch} v1/loan/category Update Loan Category
   * @apiDescription Update some fields of a loan category
   * @apiVersion 1.0.0
   * @apiName UpdateLoanCategory
   * @apiGroup LoanCategory
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   Loan Category's access token
   *
   * @apiParam  {String}             id             LoanCategory's id
   * @apiParam  {String}             type           LoanCategory's type
   * @apiParam  {String}             title          LoanCategory's title
   * @apiParam  {String}             description    LoanCategory's description
   * @apiParam  {Number}             interestRate   LoanCategory's interestRate
   *
   * @apiSuccess (Created 201) {String}  id             LoanCategory's id
   * @apiSuccess (Created 201) {String}  type           LoanCategory's type
   * @apiSuccess (Created 201) {String}  title          LoanCategory's title
   * @apiSuccess (Created 201) {String}  description    LoanCategory's description
   * @apiSuccess (Created 201) {Number}  interestRate   LoanCategory's interestRate
   * @apiSuccess (Created 201) {Date}    createdAt      Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .put(authorize(), validate(updateLoanCategory), controller.update)
  /**
   * @api {patch} v1/loan/category/:id Delete Loan Category
   * @apiDescription Delete a loan category
   * @apiVersion 1.0.0
   * @apiName DeleteLoanCategory
   * @apiGroup LoanCategory
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
   .delete(authorize(), controller.remove);

module.exports = router;
