const stripe = require('../config/stripe');
const User = require('../models/User');

class StripeService {
  
  static async createConnectAccount(user) {
    try {
      if (user.stripeAccountId) {
        return { success: true, accountId: user.stripeAccountId, alreadyExists: true };
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
      
      return { success: true, accountId: account.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  static async createAccountLink(accountId, refreshUrl, returnUrl) {
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding'
      });
      
      return { success: true, url: accountLink.url };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  static calculatePlatformFee(amount, feePercentage = 2) {
    const fee = Math.round(amount * feePercentage / 100);
    return { amount, fee, netAmount: amount - fee, feePercentage };
  }
}

module.exports = StripeService;