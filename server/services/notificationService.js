const Notification = require('../models/Notification');

class NotificationService {
  // Create notification for loan funded event
  static async loanFunded(borrowerId, lenderName, loanAmount) {
    return await Notification.create({
      userId: borrowerId,
      type: 'loan_funded',
      title: 'Loan Funded!',
      message: `Your loan of ₹${loanAmount.toLocaleString()} has been funded by ${lenderName}.`,
      icon: 'bank-card-line',  // Remix Icon: BankCardLine
      data: { event: 'loan_funded', amount: loanAmount }
    });
  }

  // Create notification for repayment due
  static async repaymentDue(userId, loanId, amount, dueDate) {
    return await Notification.create({
      userId,
      type: 'repayment_due',
      title: 'Repayment Due',
      message: `Your EMI of ₹${amount.toLocaleString()} is due on ${new Date(dueDate).toLocaleDateString()}.`,
      icon: 'calendar-alert-line',  // Remix Icon: CalendarAlertLine
      data: { event: 'repayment_due', loanId, amount, dueDate }
    });
  }

  // Create notification for repayment received
  static async repaymentReceived(lenderId, borrowerName, amount) {
    return await Notification.create({
      userId: lenderId,
      type: 'repayment_received',
      title: 'Repayment Received',
      message: `You have received ₹${amount.toLocaleString()} from ${borrowerName}.`,
      icon: 'money-rupee-circle-line',  // Remix Icon: MoneyRupeeCircleLine
      data: { event: 'repayment_received', amount }
    });
  }

  // Create notification for payment overdue
  static async paymentOverdue(userId, loanId, amount, daysOverdue) {
    return await Notification.create({
      userId,
      type: 'payment_overdue',
      title: 'Payment Overdue',
      message: `Your payment of ₹${amount.toLocaleString()} is overdue by ${daysOverdue} days. Please pay immediately.`,
      icon: 'error-warning-line',  // Remix Icon: ErrorWarningLine
      data: { event: 'payment_overdue', loanId, amount, daysOverdue }
    });
  }

  // Create notification for loan completed
  static async loanCompleted(userId, loanId, isBorrower = true) {
    return await Notification.create({
      userId,
      type: 'loan_completed',
      title: isBorrower ? 'Loan Completed!' : 'Investment Completed!',
      message: isBorrower 
        ? `Congratulations! You have successfully completed your loan repayment.`
        : `Your investment has been fully repaid. Thank you for investing!`,
      icon: 'checkbox-circle-line',  // Remix Icon: CheckboxCircleLine
      data: { event: 'loan_completed', loanId }
    });
  }

  // Create notification for welcome
  static async welcome(userId, userName) {
    return await Notification.create({
      userId,
      type: 'welcome',
      title: 'Welcome to P2P Lending!',
      message: `Hi ${userName}, welcome to the platform! Start your journey with us.`,
      icon: 'emotion-happy-line',  // Remix Icon: EmotionHappyLine
      data: { event: 'welcome' }
    });
  }

  // Create notification for general
  static async general(userId, title, message, data = {}) {
    return await Notification.create({
      userId,
      type: 'general',
      title,
      message,
      icon: 'information-line',  // Remix Icon: InformationLine
      data
    });
  }
}

module.exports = NotificationService;