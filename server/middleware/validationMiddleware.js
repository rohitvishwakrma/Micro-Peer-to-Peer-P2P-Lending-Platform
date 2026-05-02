const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['borrower', 'lender']).withMessage('Role must be borrower or lender'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateLoanRequest = [
  body('amount').isInt({ min: 10000, max: 500000 }).withMessage('Amount must be between 10,000 and 500,000'),
  body('tenure').isIn([3, 6, 12, 24, 36]).withMessage('Tenure must be 3, 6, 12, 24, or 36 months'),
  body('interestRate').isFloat({ min: 8, max: 36 }).withMessage('Interest rate must be between 8% and 36%'),
  body('purpose').isIn(['education', 'medical', 'business', 'debt', 'home', 'other']).withMessage('Invalid purpose'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateFunding = [
  body('loanId').notEmpty().withMessage('Loan ID is required'),
  body('amount').isInt({ min: 5000 }).withMessage('Minimum funding amount is 5,000'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRegister,
  validateLogin,
  validateLoanRequest,
  validateFunding
};