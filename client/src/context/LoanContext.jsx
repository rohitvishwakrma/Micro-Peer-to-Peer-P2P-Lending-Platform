import React, { createContext, useState, useContext } from 'react';
import { loanService } from '../services/loanService';
import toast from 'react-hot-toast';

const LoanContext = createContext();

export const useLoans = () => useContext(LoanContext);

export const LoanProvider = ({ children }) => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [myLoans, setMyLoans] = useState([]);
  const [fundedLoans, setFundedLoans] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);

  const createLoanRequest = async (loanData) => {
    setLoading(true);
    try {
      const response = await loanService.createLoanRequest(loanData);
      toast.success('Loan request created successfully!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create loan request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLoans = async () => {
    setLoading(true);
    try {
      const data = await loanService.getMyLoans();
      setMyLoans(data.loanRequests || []);
      setFundedLoans(data.fundedLoans || []);
      return data;
    } catch (error) {
      toast.error('Failed to fetch your loans');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanRequests = async () => {
    setLoading(true);
    try {
      const data = await loanService.getActiveLoanRequests();
      setLoanRequests(data);
      return data;
    } catch (error) {
      toast.error('Failed to fetch loan requests');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fundLoan = async (loanId, amount, paymentMethodId) => {
    setLoading(true);
    try {
      const response = await loanService.fundLoan(loanId, amount, paymentMethodId);
      toast.success('Loan funded successfully!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fund loan');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const makeRepayment = async (fundedLoanId, amount, paymentMethodId) => {
    setLoading(true);
    try {
      const response = await loanService.makeRepayment(fundedLoanId, amount, paymentMethodId);
      toast.success('Repayment successful!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to make repayment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyInvestments = async () => {
    setLoading(true);
    try {
      const data = await loanService.getMyInvestments();
      setInvestments(data);
      return data;
    } catch (error) {
      toast.error('Failed to fetch investments');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoanContext.Provider value={{
      loanRequests, myLoans, fundedLoans, investments, loading,
      createLoanRequest, fetchMyLoans, fetchLoanRequests,
      fundLoan, makeRepayment, fetchMyInvestments
    }}>
      {children}
    </LoanContext.Provider>
  );
};