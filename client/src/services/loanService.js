import api from './api';

export const loanService = {
  createLoanRequest: async (data) => {
    const response = await api.post('/loans/request', data);
    return response.data;
  },

  getActiveLoanRequests: async () => {
    const response = await api.get('/loans/requests/active');
    return response.data;
  },

  getMyLoans: async () => {
    const response = await api.get('/loans/my-loans');
    return response.data;
  },

  fundLoan: async (loanId, amount, paymentMethodId) => {
    const response = await api.post(`/loans/${loanId}/fund`, { amount, paymentMethodId });
    return response.data;
  },

  getMyInvestments: async () => {
    const response = await api.get('/loans/my-investments');
    return response.data;
  },

  makeRepayment: async (fundedLoanId, amount, paymentMethodId) => {
    const response = await api.post(`/loans/repay/${fundedLoanId}`, { amount, paymentMethodId });
    return response.data;
  },
};