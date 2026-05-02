const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, required: true },
  type: { type: String, enum: ['funding', 'repayment', 'fee', 'payout'], required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loanRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanRequest' },
  fundedLoanId: { type: mongoose.Schema.Types.ObjectId, ref: 'FundedLoan' },
  stripePaymentIntentId: String,
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

transactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);