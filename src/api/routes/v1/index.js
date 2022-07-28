const express = require('express');
const userRoutes = require('./user.route');
const notificationRoutes = require('./notification.route');
const loanRoutes = require('./loan.route');
const loanCategoryRoutes = require('./loanCategory.route');
const dealerRoutes = require('./dealer.route');
const guarantorRoutes = require('./guarantor.route');
const vehicleLoanApplicationAdviceRoutes = require('./vehicleLoanApplicationAdvice.route');
const noteRoutes = require('./note.route');
const authRoutes = require('./auth.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/loans', loanRoutes);
router.use('/loan/category', loanCategoryRoutes);
router.use('/dealers', dealerRoutes);
router.use('/guarantors', guarantorRoutes);
router.use('/vehicleLoanApplicationAdvices', vehicleLoanApplicationAdviceRoutes);
router.use('/notes', noteRoutes);
router.use('/auth', authRoutes);

module.exports = router;