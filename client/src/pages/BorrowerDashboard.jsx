import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLoans } from '../context/LoanContext';
import MyLoans from '../components/borrower/MyLoans';
import AddLine from 'remixicon-react/AddLine';
import WalletLine from 'remixicon-react/WalletLine';
import TimeLine from 'remixicon-react/TimeLine';
import CheckboxCircleLine from 'remixicon-react/CheckboxCircleLine';
import CalendarLine from 'remixicon-react/CalendarLine';
import LoaderLine from 'remixicon-react/LoaderLine';

const BorrowerDashboard = () => {
  const [stats, setStats] = useState({ totalBorrowed: 0, activeLoans: 0, completedLoans: 0, nextPayment: null, nextPaymentAmount: 0 });
  const { fundedLoans, fetchMyLoans, loading } = useLoans();

  useEffect(() => { fetchMyLoans(); }, []);

  useEffect(() => {
    if (fundedLoans?.length) {
      const active = fundedLoans.filter(l => l.status === 'active');
      const completed = fundedLoans.filter(l => l.status === 'completed');
      const totalBorrowed = active.reduce((s, l) => s + (l.outstandingAmount || l.amount), 0);
      let nextPayment = null, nextPaymentAmount = 0;
      for (const loan of active) {
        if (loan.nextRepaymentDate && (!nextPayment || new Date(loan.nextRepaymentDate) < new Date(nextPayment))) {
          nextPayment = loan.nextRepaymentDate;
          const nextInstallment = loan.repaymentSchedule?.find(i => i.status === 'pending');
          nextPaymentAmount = nextInstallment?.emiAmount || 0;
        }
      }
      setStats({ totalBorrowed, activeLoans: active.length, completedLoans: completed.length, nextPayment, nextPaymentAmount });
    }
  }, [fundedLoans]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderLine className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="text-2xl md:text-3xl font-bold text-gray-800">Borrower Dashboard</h1><p className="text-gray-500">Manage your loans</p></div>
        <Link to="/create-loan" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700">
          <AddLine className="h-5 w-5" /><span>Request Loan</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl p-5 border-l-4 border-blue-500">
          <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Total Outstanding</p><p className="text-2xl font-bold">₹{stats.totalBorrowed.toLocaleString()}</p></div><WalletLine className="h-10 w-10 text-blue-500" /></div>
        </div>
        <div className="bg-white rounded-xl p-5 border-l-4 border-yellow-500">
          <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Active Loans</p><p className="text-2xl font-bold">{stats.activeLoans}</p></div><TimeLine className="h-10 w-10 text-yellow-500" /></div>
        </div>
        <div className="bg-white rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Completed Loans</p><p className="text-2xl font-bold">{stats.completedLoans}</p></div><CheckboxCircleLine className="h-10 w-10 text-green-500" /></div>
        </div>
        <div className="bg-white rounded-xl p-5 border-l-4 border-purple-500">
          <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Next Payment</p><p className="text-xl font-bold">{stats.nextPayment ? new Date(stats.nextPayment).toLocaleDateString() : 'No due'}</p>{stats.nextPaymentAmount > 0 && <p className="text-xs text-gray-500">₹{stats.nextPaymentAmount.toLocaleString()}</p>}</div><CalendarLine className="h-10 w-10 text-purple-500" /></div>
        </div>
      </div>

      <MyLoans loans={fundedLoans || []} loading={loading} />
    </div>
  );
};

export default BorrowerDashboard;