const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/notification.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listNotifications, createNotification, updateNotification, getNotifications
} = require('../../validations/notification.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

router
  .route('/')
  
  /**
   * @api {get} v1/notifications List Of User Notfication
   * @apiDescription Get uesr notification
   * @apiVersion 1.0.0
   * @apiName UserNotifications
   * @apiGroup Notification
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   Notification's access token
   * 
   * @apiSuccess {Object[]} notification List of usernotifications.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated notifications can access the
   * data
   */
   .get(authorize(), controller.get)

  /**
   * @api {post} v1/notifications Create Notification
   * @apiDescription Create a new notification
   * @apiVersion 1.0.0
   * @apiName CreateNotification
   * @apiGroup Notification
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Notification's access token
   *
   * @apiParam  {String}             message     Notification's message
   * @apiParam  {String=user,admin}  [role]      Notification's role
   *
   * @apiSuccess (Created 201) {String}  id         Notification's id
   * @apiSuccess (Created 201) {String}  message    Notification's message
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(), validate(createNotification), controller.create);

  router
  .route('/get')
   /**
   * @api {get} v1/notifications/list List notifications
   * @apiDescription Get a list of notifications
   * @apiVersion 1.0.0
   * @apiName ListNotifications
   * @apiGroup Notification
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   Notification's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Notifications per page
   * @apiParam  {String=user,admin}  [role]       Notification's role
   *
   * @apiSuccess {Object[]} notification List of notifications.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated notifications can access the
   * data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
    .get(authorize(), validate(listNotifications), controller.list);

    router
  .route('/:id')

    /**
  * @api {put} v1/notifications/:id Update Notification
  * @apiDescription Update some fields of a notification
  * @apiVersion 1.0.0
  * @apiName UpdateNotification
  * @apiGroup Notification
  * @apiPermission user
  *
  * @apiHeader {String} Authorization   Notification's access token
  *
  * @apiParam  {String}             id             Notification's id
  * @apiParam  {String}             message        Notification's message
  * @apiParam  {Boolean}            isRead         Notification's isRead
  * @apiParam  {String}             type           Notification's type
  *
  * @apiSuccess  {String}             id             Notification's id
  * @apiSuccess  {String}             message        Notification's message
  * @apiSuccess  {Boolean}            isRead         Notification's isRead
  * @apiSuccess  {String}             type           Notification's type
  * @apiSuccess (Created 201) {Date}  createdAt      Timestamp
  *
  * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
  * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
  * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
  * @apiError (Not Found 404)    NotFound     User does not exist
  */
 .put(authorize(), validate(updateNotification), controller.update);

 router
 .route('/:type')

 /**
  * @api {get} v1/notifications/type  Get Notification by Type 
  * @apiDescription Get notification by type 
  * @apiVersion 1.0.0
  * @apiName NotificationType
  * @apiGroup Notification
  * @apiPermission user
  *
  * @apiHeader {String} Authorization   Notification's access token
  * 
  * @apiSuccess  {String}             id             Notification's id
  * @apiSuccess  {String}             message        Notification's message
  * @apiSuccess  {Boolean}            isRead         Notification's isRead
  * @apiSuccess  {String}             type           Notification's type
  * @apiSuccess (Created 201) {Date}  createdAt      Timestamp
  *
  * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
  * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
  * @apiError (Not Found 404)    NotFound     Dealer does not exist
  */
  .get(authorize(), validate(getNotifications), controller.getNotifications);
  

module.exports = router;
