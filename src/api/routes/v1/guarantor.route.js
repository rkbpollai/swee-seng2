const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/guarantor.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  getGuarantors, listGuarantors, createGuarantor, updateGuarantor
} = require('../../validations/guarantor.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

router
  .route('/')
  /**
  * @api {get} v1/guarantors List of Guarantors
  * @apiDescription Get a list of guarantors
  * @apiVersion 1.0.0
  * @apiName ListGuarantors
  * @apiGroup Guarantors
  * @apiPermission user
  *
  * @apiHeader {String} Authorization   User's access token
  *
  * @apiParam  {Number{1-}}         [page=1]     List page
  * @apiParam  {Number{1-100}}      [perPage=1]  Guarantors per page
  * @apiParam  {String=user,admin}  [role]       User's role
  *
  * @apiSuccess {Object[]} guarantor List of guarantors.
  *
  * @apiError (Unauthorized 401)  Unauthorized  Only authenticated guarantors can access the
  * data
  * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
  */
  .get(authorize(ADMIN), validate(listGuarantors), controller.list);

router
  .route('/')
  /**
   * @api {post} v1/guarantors Create Guarantor
   * @apiDescription Create a new guarantor
   * @apiVersion 1.0.0
   * @apiName CreateGuarantor
   * @apiGroup Guarantor
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String} name               Guarantor's name
   * @apiParam  {String} nricNo             Guarantor's nricNo
   * @apiParam  {String} phone              Guarantor's phone
   * @apiParam  {String} address            Guarantor's address
   * @apiParam  {String} dateOfBirth        Guarantor's address
   * @apiParam  {String} employer           Guarantor's address
   * @apiParam  {String} email              Guarantor's email
   * @apiParam  {String=user,admin} [role]  Guarantor's role
   *
   * @apiSuccess (Created 201) {String}  id             Guarantor's id
   * @apiSuccess (Created 201) {String}  name           Guarantor's name
   * @apiSuccess (Created 201) {String}  nricNo         Guarantor's nricNo
   * @apiSuccess (Created 201) {String}  phone          Guarantor's phone
   * @apiSuccess (Created 201) {String}  address        Guarantor's address
   * @apiSuccess (Created 201) {String}  dateOfBirth    Guarantor's dateOfBirth
   * @apiSuccess (Created 201) {String}  employer       Guarantor's employer
   * @apiSuccess (Created 201) {String}  email          Guarantor's email
   * @apiSuccess (Created 201) {String}  loan           Guarantor's loan
   * @apiSuccess (Created 201) {Date}    createdAt      Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createGuarantor), controller.create);

router
  .route('/:id')

  /**
   * @api {get} v1/guarantors  Get guarantor 
   * @apiDescription Get guarantor
   * @apiVersion 1.0.0
   * @apiName Guarantors
   * @apiGroup Guarantor
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   * 
   * @apiSuccess (Created 201) {String}  id             Guarantor's id
   * @apiSuccess (Created 201) {String}  name           Guarantor's name
   * @apiSuccess (Created 201) {String}  nricNo         Guarantor's nricNo
   * @apiSuccess (Created 201) {String}  phone          Guarantor's phone
   * @apiSuccess (Created 201) {String}  address        Guarantor's address
   * @apiSuccess (Created 201) {String}  dateOfBirth    Guarantor's dateOfBirth
   * @apiSuccess (Created 201) {String}  employer       Guarantor's employer
   * @apiSuccess (Created 201) {String}  email          Guarantor's email
   * @apiSuccess (Created 201) {String}  loan           Guarantor's loan
   * @apiSuccess (Created 201) {Date}    createdAt      Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Dealer does not exist
   */
  .get(authorize(ADMIN), validate(getGuarantors), controller.get)

  /**
 * @api {put} v1/guarantors Update Dealer
 * @apiDescription Update some fields of a guarantor
 * @apiVersion 1.0.0
 * @apiName UpdateGuarantor
 * @apiGroup Guarantor
 * @apiPermission user
 *
 * @apiHeader {String} Authorization  User's access token
 *
 * @apiParam  {String} id             Guarantor's id
 * @apiParam  {String} name           Guarantor's name
 * @apiParam  {String} nricNo         Guarantor's nricNo
 * @apiParam  {String} phone          Guarantor's phone
 * @apiParam  {String} address        Guarantor's address
 * @apiParam  {String} dateOfBirth    Guarantor's address
 * @apiParam  {String} employer       Guarantor's address
 * @apiParam  {String} email          Guarantor's email
 *
 * @apiSuccess (Created 201) {String}  id             Guarantor's id
 * @apiSuccess (Created 201) {String}  name           Guarantor's name
 * @apiSuccess (Created 201) {String}  nricNo         Guarantor's nricNo
 * @apiSuccess (Created 201) {String}  phone          Guarantor's phone
 * @apiSuccess (Created 201) {String}  address        Guarantor's address
 * @apiSuccess (Created 201) {String}  dateOfBirth    Guarantor's dateOfBirth
 * @apiSuccess (Created 201) {String}  employer       Guarantor's employer
 * @apiSuccess (Created 201) {String}  email          Guarantor's email
 * @apiSuccess (Created 201) {String}  loan           Guarantor's loan
 * @apiSuccess (Created 201) {Date}    createdAt      Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
 * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
 * @apiError (Not Found 404)    NotFound     User does not exist
 */
  .put(authorize(ADMIN), validate(updateGuarantor), controller.update)

  /**
    * @api {delete} v1/guarantors/:id Delete guarantor
    * @apiDescription Delete a guarantor
    * @apiVersion 1.0.0
    * @apiName DeleteGuarantor
    * @apiGroup Guarantor
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
  .delete(authorize(ADMIN), controller.remove);

  router
  .route('/loan/:id')
 
  /**
   * @api {get} v1/guarantors/loan/:id  Get Guarantors by Loan 
   * @apiDescription Get guarantors by loan 
   * @apiVersion 1.0.0
   * @apiName LoanGuarantors
   * @apiGroup Guarantor
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Loan's access token
   * 
    * @apiSuccess (Created 201) {String}  id             Guarantor's id
   * @apiSuccess (Created 201) {String}  name           Guarantor's name
   * @apiSuccess (Created 201) {String}  nricNo         Guarantor's nricNo
   * @apiSuccess (Created 201) {String}  phone          Guarantor's phone
   * @apiSuccess (Created 201) {String}  address        Guarantor's address
   * @apiSuccess (Created 201) {String}  dateOfBirth    Guarantor's dateOfBirth
   * @apiSuccess (Created 201) {String}  employer       Guarantor's employer
   * @apiSuccess (Created 201) {String}  email          Guarantor's email
   * @apiSuccess (Created 201) {String}  loan           Guarantor's loan
   * @apiSuccess (Created 201) {Date}    createdAt      Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Dealer does not exist
   */
   .get(authorize(ADMIN), validate(getGuarantors), controller.getLoanGuarantors);


module.exports = router;
