const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/loan.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  createLoan, updateLoan, listLoans, upload, getLoans, updateLoanByAdmin, calculateMonthlyRepayment, getDashboardLoans
} = require('../../validations/loan.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

router
  .route('/')

  /**
   * @api {get} v1/loans Get User's Loan
   * @apiDescription Get user's loan
   * @apiVersion 1.0.0
   * @apiName GetLoan
   * @apiGroup Loan
   * @apiPermission user
   *
   * @apiHeader {String} Authorization                    User's access token
   * @apiParam  {Number{1-}}             [page=1]         List page
   * @apiParam  {Number{1-100}}          [perPage=1]      Loan's per page
   * @apiParam  {String=user,admin}      [role]           Loan's role
   *
   * @apiSuccess (Created 201) {String}  id               Loan's id
   * @apiSuccess (Created 201) {String}  dealerCode       Loan's dealerCode
   * @apiSuccess (Created 201) {String}  type             Loan's type
   * @apiSuccess (Created 201) {String}  status           Loan's status
   * @apiSuccess (Created 201) {Date}    approvedDate     Loan's approvedDate
   * @apiSuccess (Created 201) {String}  applicationNo    Loan's applicationNo
   * @apiSuccess (Created 201) {String}  data             Loan's data
   * @apiSuccess (Created 201) {Date}    createdAt        Timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
   .get(authorize(), controller.getUserLoans)

  /**
   * @api {post} v1/loans Create Loan
   * @apiDescription Create a new loan
   * @apiVersion 1.0.0
   * @apiName Create Loan
   * @apiGroup Loan
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}       dealerCode       Loan's dealerCode
   * @apiParam  {String}       type             Loan's type
   * @apiParam  {String}       step             Loan's step 
   * @apiParam  {Object}       data             Loan's data
   *
   * @apiSuccess (Created 201) {String}  id            Loan's id
   * @apiSuccess (Created 201) {String}  applicationNo Loan's applicationNo
   * @apiSuccess (Created 201) {String}  dealerCode    Loan's dealerCode
   * @apiSuccess (Created 201) {String}  type          Loan's type
   * @apiSuccess (Created 201) {String}  data          Loan's data
   * @apiSuccess (Created 201) {Date}    createdAt     Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(), validate(createLoan), controller.create);

  router
  .route('/calculator')  

   /**
   * @api {post} v1/loans/calculator Calculate Monthly Repayment
   * @apiDescription Calculate Monthly Repayment
   * @apiVersion 1.0.0
   * @apiName Calculate Monthly Repayment
   * @apiGroup Loan
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number}       amount           Loan's amount
   * @apiParam  {Number}       interestRate     Loan's interestRate
   * @apiParam  {Number}       duration         Loan's duration 
   *
   * @apiSuccess (Created 201) {Number}    monthlyRepayment     Monthly Repayment
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(), validate(calculateMonthlyRepayment), controller.calculateMonthlyRepayment);

router
  .route('/admin/:id')
 
  /**
   * @api {put} v1/loans/admin/:id Update Loan
   * @apiDescription Update loan by admin
   * @apiVersion 1.0.0
   * @apiName UpdateLoanByAdmin
   * @apiGroup Loan
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}       dealerCode       Loan's dealerCode
   * @apiParam  {String}       type             Loan's type
   *
   * @apiSuccess (Created 201) {String}  id            Loan's id
   * @apiSuccess (Created 201) {String}  applicationNo Loan's applicationNo
   * @apiSuccess (Created 201) {String}  dealerCode    Loan's dealerCode
   * @apiSuccess (Created 201) {String}  type          Loan's type
   * @apiSuccess (Created 201) {Date}    createdAt     Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
 .put(authorize(ADMIN), validate(updateLoanByAdmin), controller.updateLoan);

router
  .route('/:id')

  /**
   * @api {put} v1/loans/:id Update Loan
   * @apiDescription Update loan
   * @apiVersion 1.0.0
   * @apiName Update Loan
   * @apiGroup Loan
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}       dealerCode       Loan's dealerCode
   * @apiParam  {String}       type             Loan's type
   * @apiParam  {String}       step             Loan's step 
   * @apiParam  {Object}       data             Loan's data
   *
   * @apiSuccess (Created 201) {String}  id            Loan's id
   * @apiSuccess (Created 201) {String}  applicationNo Loan's applicationNo
   * @apiSuccess (Created 201) {String}  dealerCode    Loan's dealerCode
   * @apiSuccess (Created 201) {String}  type          Loan's type
   * @apiSuccess (Created 201) {String}  data          Loan's data
   * @apiSuccess (Created 201) {Date}    createdAt     Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
 .put(authorize(), validate(updateLoan), controller.update)

 /**
   * @api {delete} v1/loans/:id Delete Loan
   * @apiDescription Delete a loan
   * @apiVersion 1.0.0
   * @apiName DeleteLoan
   * @apiGroup Loan
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Loan does not exist
   */
  .delete(authorize(), controller.remove);

router
  .route('/:id')
  
  /**
   * @api {get} v1/loans/:id  Get Loan 
   * @apiDescription Get Loan
   * @apiVersion 1.0.0
   * @apiName Loans
   * @apiGroup Loan
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   Loan's access token
   * 
   * @apiSuccess (Created 201) {String}  id            Loan's id
   * @apiSuccess (Created 201) {String}  applicationNo Loan's applicationNo
   * @apiSuccess (Created 201) {String}  dealerCode    Loan's dealerCode
   * @apiSuccess (Created 201) {String}  type          Loan's type
   * @apiSuccess (Created 201) {String}  data          Loan's data
   * @apiSuccess (Created 201) {Date}    createdAt     Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Dealer does not exist
   */
   .get(authorize(), validate(getLoans), controller.get);

router
  .route('/customer/:id')
  
  /**
   * @api {get} v1/loans/customer/:id  Get Loans by customers 
   * @apiDescription Get loans by customers 
   * @apiVersion 1.0.0
   * @apiName CustomerLoans
   * @apiGroup Loan
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Loan's access token
   * 
   * @apiSuccess (Created 201) {String}  id            Loan's id
   * @apiSuccess (Created 201) {String}  applicationNo Loan's applicationNo
   * @apiSuccess (Created 201) {String}  dealerCode    Loan's dealerCode
   * @apiSuccess (Created 201) {String}  type          Loan's type
   * @apiSuccess (Created 201) {Date}    createdAt     Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Dealer does not exist
   */
   .get(authorize(ADMIN), validate(getLoans), controller.getCustomerLoans);

router
  .route('/get/list')
  /**
  * @api {get} v1/loans/list List loan
  * @apiDescription Get a list of loan
  * @apiVersion 1.0.0
  * @apiName List Loan
  * @apiGroup Loan
  * @apiPermission user
  *
  * @apiHeader {String} Authorization   Loan's access token
  *
  * @apiParam  {Number{1-}}         [page=1]     List page
  * @apiParam  {Number{1-100}}      [perPage=1]  Loans per page
  * @apiParam  {String=user,admin}  [role]       Loan's role
  *
  * @apiSuccess {Object[]} loan List of loans.
  *
  * @apiError (Unauthorized 401)  Unauthorized  Only authenticated loans can access the
  * data
  * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
  */
  .get(authorize(), validate(listLoans), controller.list);
  
router
  .route('/upload/:id')

  /**
   * 
   * @api {post} v1/loans/upload:id Upload Loan Document
   * @apiDescription Upload the document
   * @apiVersion 1.0.0
   * @apiName Upload doc
   * @apiGroup Loan
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String} name     Loan's doc name
   * @apiParam  {String} type     Loan's doc types
   * @apiParam  {String} file     Loan's doc (pdf)
   *
   * @apiSuccess (Created 201) {String}  id           Loan's id
   * @apiSuccess (Created 201) {String}  dealerCode   Loan's dealerCode
   * @apiSuccess (Created 201) {String}  type         Loan's dealerCode
   * @apiSuccess (Created 201) {String}  data         Loan's data
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
   .post(authorize(), controller.upload);


router
  .route('/files/:id/:fileName')

  /**
   * @api {get} v1/loans/files/:id/:fileName Download loan doc
   * @apiDescription Get file
   * @apiVersion 1.0.0
   * @apiName Download Loan
   * @apiGroup Loan
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   * @apiParam  {String=user,admin}  [role]       Notification's role
   *
   * @apiSuccess (Created 201) {String}  id           Loan's id
   * @apiSuccess (Created 201) {String}  dealerCode   Loan's dealerCode
   * @apiSuccess (Created 201) {String}  type         Loan's dealerCode
   * @apiSuccess (Created 201) {String}  data         Loan's data
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
   .get(authorize(), controller.download);

router
   .route('/dashboard')

     /**
   * @api {get} v1/loans/dashboard  Get Dashboard Loan Data
   * @apiDescription Get dashboard loan data
   * @apiVersion 1.0.0
   * @apiName GetDashboardLoanData
   * @apiGroup Loan
   * @apiPermission user
   *
   * @apiHeader {String}              Authorization       User's access token
   * @apiParam  {String=user,admin}   [role]              Loan's role
   *
   * @apiSuccess {Object[]} loan List of loans.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated loans can access the
   * data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN), validate(getDashboardLoans), controller.getDashboardLoanData);


module.exports = router;
