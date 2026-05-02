const stripe = require('../config/stripe');
const User = require('../models/User');

exports.createConnectAccount = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== 'lender') {
      return res.status(403).json({ message: 'Only lenders can create Stripe accounts' });
    }
    
    if (user.stripeAccountId) {
      return res.status(400).json({ message: 'Stripe account already exists' });
    }
    
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'IN',
      email: user.email,
      metadata: { userId: user._id.toString() },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      }
    });
    
    user.stripeAccountId = account.id;
    user.stripeAccountStatus = 'pending';
    await user.save();
    
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.CLIENT_URL}/settings`,
      return_url: `${process.env.CLIENT_URL}/settings`,
      type: 'account_onboarding'
    });
    
    res.json({
      success: true,
      url: accountLink.url,
      accountId: account.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAccountStatus = async (req, res) => {
  try {
    const user = req.user;
    
    let status = user.stripeAccountStatus;
    
    if (user.stripeAccountId) {
      try {
        const account = await stripe.accounts.retrieve(user.stripeAccountId);
        if (account.charges_enabled && account.payouts_enabled) {
          status = 'active';
        } else if (account.requirements?.currently_due?.length > 0) {
          status = 'restricted';
        }
        
        if (status !== user.stripeAccountStatus) {
          user.stripeAccountStatus = status;
          await user.save();
        }
      } catch (err) {
        console.error('Stripe account fetch error:', err.message);
      }
    }
    
    res.json({
      success: true,
      hasAccount: !!user.stripeAccountId,
      status: status,
      accountId: user.stripeAccountId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, loanId } = req.body;
    const user = req.user;
    
    if (!amount || amount < 5000) {
      return res.status(400).json({ message: 'Minimum funding amount is 5,000' });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      metadata: {
        lenderId: user._id.toString(),
        loanId: loanId || '',
        type: 'loan_funding'
      },
      payment_method_types: ['card']
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmPaymentIntent = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId
    });
    
    res.json({
      success: true,
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.transferToLender = async (req, res) => {
  try {
    const { lenderId, amount, loanId } = req.body;
    
    const lender = await User.findById(lenderId);
    if (!lender) {
      return res.status(404).json({ message: 'Lender not found' });
    }
    
    if (!lender.stripeAccountId) {
      return res.status(400).json({ message: 'Lender has not set up Stripe account' });
    }
    
    if (lender.stripeAccountStatus !== 'active') {
      return res.status(400).json({ message: 'Lender Stripe account is not active' });
    }
    
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      destination: lender.stripeAccountId,
      metadata: { loanId: loanId || '', type: 'repayment_payout' }
    });
    
    res.json({
      success: true,
      transferId: transfer.id,
      amount: amount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};