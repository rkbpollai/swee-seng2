const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/note.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  getNotes, listNotes, createNote, updateNote
} = require('../../validations/note.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

router
  .route('/')
  /**
  * @api {get} v1/notes List of Notes
  * @apiDescription Get a list of notes
  * @apiVersion 1.0.0
  * @apiName ListNotes
  * @apiGroup Notes
  * @apiPermission user
  *
  * @apiHeader {String} Authorization   User's access token
  *
  * @apiParam  {Number{1-}}         [page=1]     List page
  * @apiParam  {Number{1-100}}      [perPage=1]  Notes per page
  * @apiParam  {String=user,admin}  [role]       User's role
  *
  * @apiSuccess {Object[]} note List of notes.
  *
  * @apiError (Unauthorized 401)  Unauthorized  Only authenticated notes can access the
  * data
  * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
  */
  .get(authorize(ADMIN), validate(listNotes), controller.list);

router
  .route('/')
  /**
   * @api {post} v1/notes Create Note
   * @apiDescription Create a new note
   * @apiVersion 1.0.0
   * @apiName CreateNote
   * @apiGroup Note
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String} title               Note's title
   * @apiParam  {String} description         Note's description
   * @apiParam  {String} loan                Note's loan
   * @apiParam  {String=user,admin} [role]   Note's role
   *
   * @apiSuccess (Created 201) {String}  id             Note's id
   * @apiSuccess (Created 201) {String}  title          Note's title
   * @apiSuccess (Created 201) {String}  description    Note's description
   * @apiSuccess (Created 201) {String}  loan           Note's loan
   * @apiSuccess (Created 201) {Date}    createdAt      Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createNote), controller.create);

router
  .route('/:id')

  /**
   * @api {get} v1/notes/:id  Get note 
   * @apiDescription Get note
   * @apiVersion 1.0.0
   * @apiName Notes
   * @apiGroup Note
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   * 
   * @apiSuccess (Created 201) {String}  id             Note's id
   * @apiSuccess (Created 201) {String}  title          Note's title
   * @apiSuccess (Created 201) {String}  description    Note's description
   * @apiSuccess (Created 201) {String}  loan           Note's loan
   * @apiSuccess (Created 201) {Date}    createdAt      Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Note does not exist
   */
  .get(authorize(ADMIN), validate(getNotes), controller.get)

  /**
 * @api {put} v1/notes Update Note
 * @apiDescription Update some fields of a note
 * @apiVersion 1.0.0
 * @apiName UpdateNote
 * @apiGroup Note
 * @apiPermission user
 *
 * @apiHeader {String} Authorization  User's access token
 *
 * @apiParam  {String} id                  Note's id
 * @apiParam  {String} title               Note's title
 * @apiParam  {String} description         Note's description
 *
 * @apiSuccess (Created 201) {String}  id             Note's id
 * @apiSuccess (Created 201) {String}  title          Note's title
 * @apiSuccess (Created 201) {String}  description    Note's description
 * @apiSuccess (Created 201) {String}  loan           Note's loan
 * @apiSuccess (Created 201) {Date}    createdAt      Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
 * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
 * @apiError (Not Found 404)    NotFound     Note does not exist
 */
  .put(authorize(ADMIN), validate(updateNote), controller.update)

  /**
    * @api {delete} v1/notes/:id Delete note
    * @apiDescription Delete a note
    * @apiVersion 1.0.0
    * @apiName DeleteNote
    * @apiGroup Note
    * @apiPermission user
    *
    * @apiHeader {String} Authorization   User's access token
    *
    * @apiSuccess (No Content 204)  Successfully deleted
    *
    * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
    * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
    * @apiError (Not Found 404)    NotFound      Note does not exist
    */
  .delete(authorize(ADMIN), controller.remove);

  router
  .route('/loan/:id')
 
  /**
   * @api {get} v1/notes/loan/:id  Get Notes by Loan 
   * @apiDescription Get notes by loan 
   * @apiVersion 1.0.0
   * @apiName LoanNotes
   * @apiGroup Note
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Loan's access token
   * 
   * @apiSuccess (Created 201) {String}  id             Note's id
   * @apiSuccess (Created 201) {String}  title          Note's title
   * @apiSuccess (Created 201) {String}  description    Note's description
   * @apiSuccess (Created 201) {String}  loan           Note's loan
   * @apiSuccess (Created 201) {Date}    createdAt      Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Note does not exist
   */
   .get(authorize(ADMIN), validate(getNotes), controller.getLoanNotes);


module.exports = router;
