export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const LOAN_PURPOSES = [
  { value: 'education', label: 'Education', description: 'Tuition fees, courses, study abroad' },
  { value: 'medical', label: 'Medical Emergency', description: 'Hospital bills, treatment costs' },
  { value: 'business', label: 'Business Expansion', description: 'Working capital, inventory' },
  { value: 'debt', label: 'Debt Consolidation', description: 'Pay off existing loans' },
  { value: 'home', label: 'Home Improvement', description: 'Renovation, furniture' },
  { value: 'other', label: 'Other', description: 'Any genuine need' }
];

export const TENURE_OPTIONS = [
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 12, label: '12 months' },
  { value: 24, label: '24 months' },
  { value: 36, label: '36 months' }
];

export const INTEREST_RATES = {
  min: 8,
  max: 36,
  default: 12
};

export const LOAN_AMOUNTS = {
  min: 10000,
  max: 500000,
  default: 50000
};