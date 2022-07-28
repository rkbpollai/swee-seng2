const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/dealer.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  getDealers, listDealers, createDealer, updateDealer
} = require('../../validations/dealer.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

router
  .route('/list')  
  /**
  * @api {get} v1/dealers List of Dealers
  * @apiDescription Get a list of dealers
  * @apiVersion 1.0.0
  * @apiName ListDealers
  * @apiGroup Dealer
  * @apiPermission user
  *
  * @apiHeader {String} Authorization   Loan's access token
  *
  * @apiParam  {Number{1-}}         [page=1]     List page
  * @apiParam  {Number{1-100}}      [perPage=1]  Dealer per page
  * @apiParam  {String=user,admin}  [role]       Dealer's role
  *
  * @apiSuccess {Object[]} dealer List of dealers.
  *
  * @apiError (Unauthorized 401)  Unauthorized  Only authenticated dealers can access the
  * data
  * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
  */
  .get(authorize(), validate(listDealers), controller.list);

router
  .route('/')
  /**
   * @api {post} v1/dealers Create Dealer
   * @apiDescription Create a new dealer
   * @apiVersion 1.0.0
   * @apiName CreateDealer
   * @apiGroup Dealer
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Dealer's access token
   *
   * @apiParam  {String}             dealerName   Dealer's name
   * @apiParam  {String}             icNo         Dealer's icNo
   * @apiParam  {String}             companyRegNo Dealer's companyRegNo
   * @apiParam  {String}             dealerCode   Dealer's dealerCode
   * @apiParam  {String}             phone        Dealer's phone
   * @apiParam  {String}             address      Dealer's address
   * @apiParam  {String}             email        Dealer's email
   * @apiParam  {String}             status       Dealer's status
   * @apiParam  {String=user,admin}  [role]       Dealer's role
   *
   * @apiSuccess (Created 201) {String}  id            Dealer's id
   * @apiSuccess (Created 201) {String}  dealerName    Dealer's name
   * @apiSuccess (Created 201) {String}  icNo          Dealer's icNo
   * @apiSuccess (Created 201) {String}  companyRegNo  Dealer's companyRegNo
   * @apiSuccess (Created 201) {String}  phone         Dealer's phone
   * @apiSuccess (Created 201) {String}  address       Dealer's address
   * @apiSuccess (Created 201) {String}  email         Dealer's email
   * @apiSuccess (Created 201) {String}  status        Dealer's status
   * @apiSuccess (Created 201) {Date}    createdAt     Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(), validate(createDealer), controller.create);

  router
  .route('/:id')
  
  /**
   * @api {get} v1/dealers  Get Dealer 
   * @apiDescription Get Dealer
   * @apiVersion 1.0.0
   * @apiName Dealers
   * @apiGroup Dealer
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   Dealer's access token
   * 
   * @apiSuccess (Created 201) {String}  id            Dealer's id
   * @apiSuccess (Created 201) {String}  dealerName    Dealer's name
   * @apiSuccess (Created 201) {String}  icNo          Dealer's icNo
   * @apiSuccess (Created 201) {String}  companyRegNo  Dealer's companyRegNo
   * @apiSuccess (Created 201) {String}  phone         Dealer's phone
   * @apiSuccess (Created 201) {String}  address       Dealer's address
   * @apiSuccess (Created 201) {String}  email         Dealer's email
   * @apiSuccess (Created 201) {String}  status        Dealer's status
   * @apiSuccess (Created 201) {Date}    createdAt     Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Dealer does not exist
   */
   .get(authorize(), validate(getDealers), controller.get)

   /**
  * @api {put} v1/dealers Update Dealer
  * @apiDescription Update some fields of a dealer
  * @apiVersion 1.0.0
  * @apiName UpdateDealer
  * @apiGroup Dealer
  * @apiPermission user
  *
  * @apiHeader {String} Authorization   Dealer's access token
  *
  * @apiParam  {String}             id             Dealer's id
  * @apiParam  {String}             dealerName           Dealer's name
  * @apiParam  {String}             icNo           Dealer's icNo
  * @apiParam  {String}             companyRegNo   Dealer's companyRegNo
  * @apiParam  {String}             dealerCode     Dealer's dealerCode
  * @apiParam  {String}             phone          Dealer's phone
  * @apiParam  {String}             address        Dealer's address
  * @apiParam  {String}             email          Dealer's email
  * @apiParam  {String}             status         Dealer's status
  *
  * @apiSuccess (Created 201) {String}  id            Dealer's id
  * @apiSuccess (Created 201) {String}  dealerName    Dealer's name
  * @apiSuccess (Created 201) {String}  icNo          Dealer's icNo
  * @apiSuccess (Created 201) {String}  companyRegNo  Dealer's companyRegNo
  * @apiSuccess (Created 201) {String}  dealerCode    Dealer's dealerCode
  * @apiSuccess (Created 201) {String}  phone         Dealer's phone
  * @apiSuccess (Created 201) {String}  address       Dealer's address
  * @apiSuccess (Created 201) {String}  email         Dealer's email
  * @apiSuccess (Created 201) {String}  status        Dealer's status
  * @apiSuccess (Created 201) {Date}    createdAt     Timestamp
  *
  * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
  * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
  * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
  * @apiError (Not Found 404)    NotFound     User does not exist
  */
 .put(authorize(), validate(updateDealer), controller.update)

 /**
   * @api {delete} v1/dealers/:id Delete Dealer
   * @apiDescription Delete a dealer
   * @apiVersion 1.0.0
   * @apiName DeleteDealer
   * @apiGroup Dealer
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
