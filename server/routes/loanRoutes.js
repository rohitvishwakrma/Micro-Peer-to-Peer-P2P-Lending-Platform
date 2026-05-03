const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  createLoanRequest,
  getActiveLoanRequests,
  getMyLoans,
  fundLoan,
  getMyInvestments,
  makeRepayment
} = require('../controllers/loanController');

const router = express.Router();

router.post('/request', protect, authorize('borrower'), createLoanRequest);
router.get('/my-loans', protect, authorize('borrower'), getMyLoans);
router.post('/repay/:fundedLoanId', protect, authorize('borrower'), makeRepayment);
router.get('/requests/active', protect, authorize('lender'), getActiveLoanRequests);
router.post('/:loanId/fund', protect, authorize('lender'), fundLoan);
router.get('/my-investments', protect, getMyInvestments);

module.exports = router;