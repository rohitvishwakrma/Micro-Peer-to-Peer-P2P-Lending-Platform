const calculateEMI = (principal, interestRate, tenure) => {
  const monthlyRate = interestRate / 100 / 12;
  if (monthlyRate === 0) return Math.round(principal / tenure);
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

const generateTransactionId = (prefix = 'TXN') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

module.exports = { calculateEMI, formatCurrency, generateTransactionId };