const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/vehicleLoanApplicationAdvice.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");
const {
  getVehicleLoanApplicationAdvices,
  listVehicleLoanApplicationAdvices,
  createVehicleLoanApplicationAdvice,
  updateVehicleLoanApplicationAdvice,
} = require("../../validations/vehicleLoanApplicationAdvice.validation");

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param("userId", controller.load);

router
  .route("/")
  /**
   * @api {get} v1/vehicleLoanApplicationAdvices List of VehicleLoanApplicationAdvices
   * @apiDescription Get a list of vehicleLoanApplicationAdvices
   * @apiVersion 1.0.0
   * @apiName ListVehicleLoanApplicationAdvices
   * @apiGroup VehicleLoanApplicationAdvices
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  VehicleLoanApplicationAdvice per page
   * @apiParam  {String=user,admin}  [role]       User's role
   *
   * @apiSuccess {Object[]} vehicleLoanApplicationAdvice List of vehicleLoanApplicationAdvices.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated vehicleLoanApplicationAdvices can access the
   * data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(
    authorize(ADMIN),
    validate(listVehicleLoanApplicationAdvices),
    controller.list
  );

router
  .route("/")
  /**
   * @api {post} v1/vehicleLoanApplicationAdvices Create VehicleLoanApplicationAdvice
   * @apiDescription Create a new vehicleLoanApplicationAdvice
   * @apiVersion 1.0.0
   * @apiName CreateVehicleLoanApplicationAdvice
   * @apiGroup VehicleLoanApplicationAdvice
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String} coeExpiryDate               vehicleLoanApplicationAdvice's coeExpiryDate
   * @apiParam  {Number} approvedLoanAmount          vehicleLoanApplicationAdvice's approvedLoanAmount
   * @apiParam  {String} approvedTenure              vehicleLoanApplicationAdvice's approvedTenure
   * @apiParam  {Number} processingFee               vehicleLoanApplicationAdvice's processingFee
   * @apiParam  {String} repaymentMode               vehicleLoanApplicationAdvice's repaymentMode
   * @apiParam  {String} hirePurchaseType            vehicleLoanApplicationAdvice's hirePurchaseType
   * @apiParam  {String} vehicleType                 vehicleLoanApplicationAdvice's vehicleType
   * @apiParam  {String} loan                        vehicleLoanApplicationAdvice's loan
   * @apiParam  {String} status                      vehicleLoanApplicationAdvice's status
   * @apiParam  {String=user,admin} [role]           vehicleLoanApplicationAdvice's role
   *
   * @apiSuccess (Created 201) {String}  id                     vehicleLoanApplicationAdvice's id
   * @apiSuccess (Created 201) {String}  coeExpiryDate          vehicleLoanApplicationAdvice's coeExpiryDate
   * @apiSuccess (Created 201) {Number}  approvedLoanAmount     vehicleLoanApplicationAdvice's approvedLoanAmount
   * @apiSuccess (Created 201) {String}  approvedTenure         vehicleLoanApplicationAdvice's approvedTenure
   * @apiSuccess (Created 201) {Number}  processingFee          vehicleLoanApplicationAdvice's processingFee
   * @apiSuccess (Created 201) {String}  repaymentMode          vehicleLoanApplicationAdvice's repaymentMode
   * @apiSuccess (Created 201) {String}  hirePurchaseType       vehicleLoanApplicationAdvice's hirePurchaseType
   * @apiSuccess (Created 201) {String}  vehicleType            vehicleLoanApplicationAdvice's vehicleType
   * @apiSuccess (Created 201) {String}  status                 vehicleLoanApplicationAdvice's status
   * @apiSuccess (Created 201) {String}  loan                   vehicleLoanApplicationAdvice's loan
   * @apiSuccess (Created 201) {Date}    createdAt              Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(
    authorize(ADMIN),
    validate(createVehicleLoanApplicationAdvice),
    controller.create
  );

router
  .route("/:id")

  /**
   * @api {get} v1/vehicleLoanApplicationAdvices/:id  Get vehicleLoanApplicationAdvice
   * @apiDescription Get vehicleLoanApplicationAdvice
   * @apiVersion 1.0.0
   * @apiName VehicleLoanApplicationAdvices
   * @apiGroup VehicleLoanApplicationAdvice
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (Created 201) {String}  id                     vehicleLoanApplicationAdvice's id
   * @apiSuccess (Created 201) {String}  coeExpiryDate          vehicleLoanApplicationAdvice's coeExpiryDate
   * @apiSuccess (Created 201) {Number}  approvedLoanAmount     vehicleLoanApplicationAdvice's approvedLoanAmount
   * @apiSuccess (Created 201) {String}  approvedTenure         vehicleLoanApplicationAdvice's approvedTenure
   * @apiSuccess (Created 201) {Number}  processingFee          vehicleLoanApplicationAdvice's processingFee
   * @apiSuccess (Created 201) {String}  repaymentMode          vehicleLoanApplicationAdvice's repaymentMode
   * @apiSuccess (Created 201) {String}  hirePurchaseType       vehicleLoanApplicationAdvice's hirePurchaseType
   * @apiSuccess (Created 201) {String}  vehicleType            vehicleLoanApplicationAdvice's vehicleType
   * @apiSuccess (Created 201) {String}  status                 vehicleLoanApplicationAdvice's status
   * @apiSuccess (Created 201) {String}  loan                   vehicleLoanApplicationAdvice's loan
   * @apiSuccess (Created 201) {Date}    createdAt              Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     VehicleLoanApplicationAdvice does not exist
   */
  .get(
    authorize(ADMIN),
    validate(getVehicleLoanApplicationAdvices),
    controller.get
  )

  /**
   * @api {put} v1/vehicleLoanApplicationAdvices/:id Update VehicleLoanApplicationAdvice
   * @apiDescription Update some fields of a vehicleLoanApplicationAdvice
   * @apiVersion 1.0.0
   * @apiName UpdateVehicleLoanApplicationAdvice
   * @apiGroup VehicleLoanApplicationAdvice
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String} id                          vehicleLoanApplicationAdvice's id
   * @apiParam  {String} coeExpiryDate               vehicleLoanApplicationAdvice's coeExpiryDate
   * @apiParam  {Number} approvedLoanAmount          vehicleLoanApplicationAdvice's approvedLoanAmount
   * @apiParam  {String} approvedTenure              vehicleLoanApplicationAdvice's approvedTenure
   * @apiParam  {Number} processingFee               vehicleLoanApplicationAdvice's processingFee
   * @apiParam  {String} repaymentMode               vehicleLoanApplicationAdvice's repaymentMode
   * @apiParam  {String} hirePurchaseType            vehicleLoanApplicationAdvice's hirePurchaseType
   * @apiParam  {String} vehicleType                 vehicleLoanApplicationAdvice's vehicleType
   * @apiParam  {String} status                      vehicleLoanApplicationAdvice's status
   *
   * @apiSuccess (Created 201) {String}  id                     vehicleLoanApplicationAdvice's id
   * @apiSuccess (Created 201) {String}  coeExpiryDate          vehicleLoanApplicationAdvice's coeExpiryDate
   * @apiSuccess (Created 201) {Number}  approvedLoanAmount     vehicleLoanApplicationAdvice's approvedLoanAmount
   * @apiSuccess (Created 201) {String}  approvedTenure         vehicleLoanApplicationAdvice's approvedTenure
   * @apiSuccess (Created 201) {Number}  processingFee          vehicleLoanApplicationAdvice's processingFee
   * @apiSuccess (Created 201) {String}  repaymentMode          vehicleLoanApplicationAdvice's repaymentMode
   * @apiSuccess (Created 201) {String}  hirePurchaseType       vehicleLoanApplicationAdvice's hirePurchaseType
   * @apiSuccess (Created 201) {String}  vehicleType            vehicleLoanApplicationAdvice's vehicleType
   * @apiSuccess (Created 201) {String}  status                 vehicleLoanApplicationAdvice's status
   * @apiSuccess (Created 201) {String}  loan                   vehicleLoanApplicationAdvice's loan
   * @apiSuccess (Created 201) {Date}    createdAt              Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     VehicleLoanApplicationAdvice does not exist
   */
  .put(
    authorize(ADMIN),
    validate(updateVehicleLoanApplicationAdvice),
    controller.update
  )

  /**
   * @api {delete} v1/vehicleLoanApplicationAdvices/:id Delete vehicleLoanApplicationAdvice
   * @apiDescription Delete a vehicleLoanApplicationAdvice
   * @apiVersion 1.0.0
   * @apiName DeleteVehicleLoanApplicationAdvice
   * @apiGroup VehicleLoanApplicationAdvice
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      VehicleLoanApplicationAdvice does not exist
   */
  .delete( authorize(ADMIN), controller.remove);

router
  .route("/loan/:id")

  /**
   * @api {get} v1/vehicleLoanApplicationAdvices/loan/:id  Get VehicleLoanApplicationAdvices by Loan
   * @apiDescription Get vehicleLoanApplicationAdvices by loan
   * @apiVersion 1.0.0
   * @apiName LoanVehicleLoanApplicationAdvices
   * @apiGroup VehicleLoanApplicationAdvice
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Loan's access token
   *
   * @apiSuccess (Created 201) {String}  id                    vehicleLoanApplicationAdvice's id
   * @apiSuccess (Created 201) {String}  coeExpiryDate          vehicleLoanApplicationAdvice's coeExpiryDate
   * @apiSuccess (Created 201) {Number}  approvedLoanAmount     vehicleLoanApplicationAdvice's approvedLoanAmount
   * @apiSuccess (Created 201) {String}  approvedTenure         vehicleLoanApplicationAdvice's approvedTenure
   * @apiSuccess (Created 201) {Number}  processingFee          vehicleLoanApplicationAdvice's processingFee
   * @apiSuccess (Created 201) {String}  repaymentMode          vehicleLoanApplicationAdvice's repaymentMode
   * @apiSuccess (Created 201) {String}  hirePurchaseType       vehicleLoanApplicationAdvice's hirePurchaseType
   * @apiSuccess (Created 201) {String}  vehicleType            vehicleLoanApplicationAdvice's vehicleType
   * @apiSuccess (Created 201) {String}  status                 vehicleLoanApplicationAdvice's status
   * @apiSuccess (Created 201) {String}  loan                   vehicleLoanApplicationAdvice's loan
   * @apiSuccess (Created 201) {Date}    createdAt              Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     VehicleLoanApplicationAdvice does not exist
   */
  .get(
    authorize(ADMIN),
    validate(getVehicleLoanApplicationAdvices),
    controller.getLoanVehicleLoanApplicationAdvices
  );

module.exports = router;
