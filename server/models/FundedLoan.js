const mongoose = require('mongoose');

const repaymentScheduleSchema = new mongoose.Schema({
  installmentNo: Number,
  dueDate: Date,
  emiAmount: Number,
  principalAmount: Number,
  interestAmount: Number,
  outstandingBalance: Number,
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  paidAt: Date,
  transactionId: String
});

const fundedLoanSchema = new mongoose.Schema({
  loanRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanRequest', required: true },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenure: { type: Number, required: true },
  repaidAmount: { type: Number, default: 0 },
  outstandingAmount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'completed', 'defaulted'], default: 'active' },
  repaymentSchedule: [repaymentScheduleSchema],
  nextRepaymentDate: Date,
  disbursementDate: { type: Date, default: Date.now },
  completedAt: Date
});

fundedLoanSchema.methods.generateRepaymentSchedule = function() {
  const schedule = [];
  let outstanding = this.amount;
  const monthlyRate = this.interestRate / 100 / 12;
  const emi = this.amount * monthlyRate * Math.pow(1 + monthlyRate, this.tenure) / 
              (Math.pow(1 + monthlyRate, this.tenure) - 1);
  
  for (let i = 1; i <= this.tenure; i++) {
    const interest = outstanding * monthlyRate;
    const principal = emi - interest;
    outstanding -= principal;
    schedule.push({
      installmentNo: i,
      dueDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000),
      emiAmount: Math.round(emi),
      principalAmount: Math.round(principal),
      interestAmount: Math.round(interest),
      outstandingBalance: Math.round(Math.max(0, outstanding)),
      status: 'pending'
    });
  }
  this.repaymentSchedule = schedule;
  this.nextRepaymentDate = schedule[0]?.dueDate;
  return schedule;
};

module.exports = mongoose.model('FundedLoan', fundedLoanSchema);