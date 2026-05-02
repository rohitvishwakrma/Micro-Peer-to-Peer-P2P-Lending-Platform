const mongoose = require('mongoose');

const loanRequestSchema = new mongoose.Schema({
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 10000, max: 500000 },
  tenure: { type: Number, required: true, enum: [3, 6, 12, 24, 36] },
  interestRate: { type: Number, required: true, min: 8, max: 36 },
  purpose: { type: String, required: true, enum: ['education', 'medical', 'business', 'debt', 'home', 'other'] },
  description: { type: String, maxlength: 500 },
  fundedAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'partially_funded', 'funded', 'expired'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) }
});

loanRequestSchema.virtual('monthlyPayment').get(function() {
  const P = this.amount;
  const r = this.interestRate / 100 / 12;
  const n = this.tenure;
  if (P === 0 || r === 0) return Math.round(P / n);
  return Math.round(P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
});

loanRequestSchema.virtual('remainingAmount').get(function() {
  return this.amount - this.fundedAmount;
});

loanRequestSchema.set('toJSON', { virtuals: true });
loanRequestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('LoanRequest', loanRequestSchema);