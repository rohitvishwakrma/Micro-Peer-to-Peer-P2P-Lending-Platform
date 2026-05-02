const FundedLoan = require('../models/FundedLoan');

const generateMonthlyRepaymentDues = async () => {
  console.log('Running cron job: Generate monthly repayment dues');
  
  try {
    const activeLoans = await FundedLoan.find({ 
      status: 'active',
      repaymentSchedule: { $exists: false }
    });
    
    for (const loan of activeLoans) {
      loan.generateRepaymentSchedule();
      await loan.save();
      console.log(`Repayment schedule generated for loan ${loan._id}`);
    }
    
    console.log(`Generated schedules for ${activeLoans.length} loans`);
  } catch (error) {
    console.error('Error generating repayment dues:', error);
  }
};

const checkOverduePayments = async () => {
  console.log('Running cron job: Check overdue payments');
  const today = new Date();
  
  try {
    const overdueLoans = await FundedLoan.find({
      status: 'active',
      nextRepaymentDate: { $lt: today }
    });
    
    let overdueCount = 0;
    
    for (const loan of overdueLoans) {
      const overdueInstallment = loan.repaymentSchedule?.find(
        i => i.status === 'pending' && new Date(i.dueDate) < today
      );
      
      if (overdueInstallment && overdueInstallment.status !== 'overdue') {
        overdueInstallment.status = 'overdue';
        await loan.save();
        overdueCount++;
        console.log(`Loan ${loan._id} marked as overdue`);
      }
    }
    
    console.log(`Marked ${overdueCount} loans as overdue`);
  } catch (error) {
    console.error('Error checking overdue payments:', error);
  }
};

const sendPaymentReminders = async () => {
  console.log('Running cron job: Send payment reminders');
  const today = new Date();
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  try {
    const upcomingPayments = await FundedLoan.find({
      status: 'active',
      nextRepaymentDate: { 
        $gte: today,
        $lte: threeDaysFromNow
      }
    }).populate('borrowerId', 'name email');
    
    console.log(`Sent reminders for ${upcomingPayments.length} loans`);
  } catch (error) {
    console.error('Error sending payment reminders:', error);
  }
};

module.exports = {
  generateMonthlyRepaymentDues,
  checkOverduePayments,
  sendPaymentReminders
};