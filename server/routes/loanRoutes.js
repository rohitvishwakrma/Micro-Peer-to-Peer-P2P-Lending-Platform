const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateLoanRequest, validateFunding } = require('../middleware/validationMiddleware');
const {
  createLoanRequest,
  getActiveLoanRequests,
  getMyLoans,
  fundLoan,
  getMyInvestments,
  makeRepayment
} = require('../controllers/loanController');

const router = express.Router();

router.post('/request', protect, authorize('borrower'), validateLoanRequest, createLoanRequest);
router.get('/my-loans', protect, authorize('borrower'), getMyLoans);
router.post('/repay/:fundedLoanId', protect, authorize('borrower'), makeRepayment);
router.get('/requests/active', protect, authorize('lender'), getActiveLoanRequests);
router.post('/:loanId/fund', protect, authorize('lender'), validateFunding, fundLoan);
router.get('/my-investments', protect, authorize('lender'), getMyInvestments);

module.exports = router;