const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"P2P Lending" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (to, name) => {
  const subject = 'Welcome to P2P Lending Platform';
  const html = `<h2>Welcome ${name}!</h2><p>Thank you for joining our platform.</p>`;
  return await sendEmail(to, subject, html);
};

const sendLoanFundedEmail = async (to, name, loanAmount, lenderName) => {
  const subject = 'Your Loan Has Been Funded!';
  const html = `<h2>Congratulations!</h2><p>Your loan of Rs. ${loanAmount.toLocaleString()} has been funded by ${lenderName}.</p>`;
  return await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendLoanFundedEmail
};