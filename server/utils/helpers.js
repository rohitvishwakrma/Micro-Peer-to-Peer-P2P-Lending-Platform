const calculateEMI = (principal, interestRate, tenure) => {
  const monthlyRate = interestRate / 100 / 12;
  if (monthlyRate === 0) return Math.round(principal / tenure);
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

const generateTransactionId = (prefix = 'TXN') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

const isValidLoanAmount = (amount) => {
  return amount >= 10000 && amount <= 500000;
};

const isValidInterestRate = (rate) => {
  return rate >= 8 && rate <= 36;
};

const isValidTenure = (tenure) => {
  return [3, 6, 12, 24, 36].includes(tenure);
};

module.exports = {
  calculateEMI,
  formatCurrency,
  generateTransactionId,
  isValidLoanAmount,
  isValidInterestRate,
  isValidTenure
};