const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { 
  createConnectAccount,
  getAccountStatus,
  createPaymentIntent,
  confirmPaymentIntent,
  transferToLender
} = require('../controllers/stripeController');

router.post('/create-connect-account', protect, authorize('lender'), createConnectAccount);
router.get('/account-status', protect, authorize('lender'), getAccountStatus);
router.post('/create-payment-intent', protect, authorize('lender'), createPaymentIntent);
router.post('/confirm-payment-intent', protect, authorize('lender'), confirmPaymentIntent);
router.post('/transfer-to-lender', protect, transferToLender);

module.exports = router;