const mongoose = require('mongoose');
const LoanRequest = require('../models/LoanRequest');
const FundedLoan = require('../models/FundedLoan');
const Transaction = require('../models/Transaction');

const calculateEMI = (amount, interestRate, tenure) => {
  const r = interestRate / 100 / 12;
  const n = tenure;
  if (amount === 0 || r === 0) return Math.round(amount / n);
  return Math.round(amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
};

const generateRepaymentSchedule = (amount, interestRate, tenure) => {
  const schedule = [];
  let outstanding = amount;
  const monthlyRate = interestRate / 100 / 12;
  const emi = calculateEMI(amount, interestRate, tenure);
  
  for (let i = 1; i <= tenure; i++) {
    const interest = outstanding * monthlyRate;
    const principal = emi - interest;
    outstanding -= principal;
    schedule.push({
      installmentNo: i,
      dueDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000),
      emiAmount: emi,
      principalAmount: Math.round(principal),
      interestAmount: Math.round(interest),
      outstandingBalance: Math.round(Math.max(0, outstanding)),
      status: 'pending'
    });
  }
  return schedule;
};

exports.createLoanRequest = async (req, res) => {
  try {
    const { amount, tenure, interestRate, purpose, description } = req.body;
    
    const loanRequest = new LoanRequest({
      borrowerId: req.user._id,
      amount,
      tenure,
      interestRate,
      purpose,
      description
    });
    
    await loanRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'Loan request created successfully',
      loanRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveLoanRequests = async (req, res) => {
  try {
    const loanRequests = await LoanRequest.find({
      status: { $in: ['pending', 'partially_funded'] }
    })
    .populate('borrowerId', 'name')
    .sort({ createdAt: -1 });
    
    const requestsWithEMI = loanRequests.map(loan => ({
      ...loan.toObject(),
      monthlyPayment: calculateEMI(loan.amount, loan.interestRate, loan.tenure)
    }));
    
    res.json(requestsWithEMI);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyLoans = async (req, res) => {
  try {
    const loanRequests = await LoanRequest.find({ borrowerId: req.user._id })
      .sort({ createdAt: -1 });
    
    const fundedLoans = await FundedLoan.find({ borrowerId: req.user._id })
      .populate('lenderId', 'name');
    
    res.json({ loanRequests, fundedLoans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fundLoan = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { loanId, amount } = req.body;
    
    const loanRequest = await LoanRequest.findById(loanId).session(session);
    if (!loanRequest) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Loan request not found' });
    }
    
    loanRequest.fundedAmount += amount;
    if (loanRequest.fundedAmount >= loanRequest.amount) {
      loanRequest.status = 'funded';
    } else {
      loanRequest.status = 'partially_funded';
    }
    await loanRequest.save({ session });
    
    let fundedLoan = null;
    
    if (loanRequest.status === 'funded') {
      fundedLoan = new FundedLoan({
        loanRequestId: loanRequest._id,
        borrowerId: loanRequest.borrowerId,
        lenderId: req.user._id,
        amount: loanRequest.amount,
        interestRate: loanRequest.interestRate,
        tenure: loanRequest.tenure,
        outstandingAmount: loanRequest.amount,
        status: 'active'
      });
      await fundedLoan.save({ session });
      
      const schedule = generateRepaymentSchedule(
        fundedLoan.amount,
        fundedLoan.interestRate,
        fundedLoan.tenure
      );
      fundedLoan.repaymentSchedule = schedule;
      fundedLoan.nextRepaymentDate = schedule[0]?.dueDate;
      await fundedLoan.save({ session });
      
      const transaction = new Transaction({
        type: 'funding',
        amount: amount,
        fee: 0,
        netAmount: amount,
        lenderId: req.user._id,
        borrowerId: loanRequest.borrowerId,
        loanRequestId: loanRequest._id,
        fundedLoanId: fundedLoan._id,
        status: 'success'
      });
      await transaction.save({ session });
    }
    
    await session.commitTransaction();
    
    res.json({
      success: true,
      message: loanRequest.status === 'funded' ? 'Loan fully funded!' : 'Loan funded successfully',
      loanRequest,
      fundedLoan
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

exports.getMyInvestments = async (req, res) => {
  try {
    const investments = await FundedLoan.find({ lenderId: req.user._id })
      .populate('borrowerId', 'name')
      .sort({ createdAt: -1 });
    
    const investmentsWithDetails = investments.map(inv => ({
      ...inv.toObject(),
      monthlyEMI: calculateEMI(inv.amount, inv.interestRate, inv.tenure),
      expectedReturns: calculateEMI(inv.amount, inv.interestRate, inv.tenure) * inv.tenure - inv.amount
    }));
    
    res.json(investmentsWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.makeRepayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { fundedLoanId } = req.params;
    const { amount } = req.body;
    
    const fundedLoan = await FundedLoan.findById(fundedLoanId).session(session);
    if (!fundedLoan) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    if (fundedLoan.status !== 'active') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Loan is not active' });
    }
    
    const pendingInstallment = fundedLoan.repaymentSchedule.find(i => i.status === 'pending');
    if (!pendingInstallment) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'No pending installment' });
    }
    
    if (amount < pendingInstallment.emiAmount) {
      await session.abortTransaction();
      return res.status(400).json({ message: `Minimum payment is ${pendingInstallment.emiAmount}` });
    }
    
    pendingInstallment.status = 'paid';
    pendingInstallment.paidAt = new Date();
    
    fundedLoan.repaidAmount += pendingInstallment.emiAmount;
    fundedLoan.outstandingAmount -= pendingInstallment.principalAmount;
    
    if (fundedLoan.outstandingAmount <= 0) {
      fundedLoan.status = 'completed';
      fundedLoan.completedAt = new Date();
      fundedLoan.nextRepaymentDate = null;
    } else {
      const nextInstallment = fundedLoan.repaymentSchedule.find(i => i.status === 'pending');
      fundedLoan.nextRepaymentDate = nextInstallment?.dueDate || null;
    }
    
    await fundedLoan.save({ session });
    
    const platformFeePercent = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE) || 2;
    const platformFee = Math.round(pendingInstallment.emiAmount * platformFeePercent / 100);
    const lenderAmount = pendingInstallment.emiAmount - platformFee;
    
    const transaction = new Transaction({
      type: 'repayment',
      amount: pendingInstallment.emiAmount,
      fee: platformFee,
      netAmount: lenderAmount,
      borrowerId: fundedLoan.borrowerId,
      lenderId: fundedLoan.lenderId,
      fundedLoanId: fundedLoan._id,
      status: 'success'
    });
    await transaction.save({ session });
    
    await session.commitTransaction();
    
    res.json({
      success: true,
      message: 'Repayment successful',
      fundedLoan,
      transaction
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};