import React, { useState, useEffect } from 'react';
import { useLoans } from '../context/LoanContext';
import MyInvestments from '../components/lender/MyInvestments';
import WalletLine from 'remixicon-react/WalletLine';
import TrendingUpLine from 'remixicon-react/TrendingUpLine';
import MoneyCnyCircleLine from 'remixicon-react/MoneyCnyCircleLine';
import BriefcaseLine from 'remixicon-react/BriefcaseLine';
import LoaderLine from 'remixicon-react/LoaderLine';

const LenderDashboard = () => {
  const [stats, setStats] = useState({ totalInvested: 0, expectedReturns: 0, realizedReturns: 0, activeInvestments: 0, averageInterest: 0 });
  const { investments, fetchMyInvestments, loading } = useLoans();

  useEffect(() => { fetchMyInvestments(); }, []);

  useEffect(() => {
    if (investments?.length) {
      const totalInvested = investments.reduce((s, inv) => s + (inv.amount || 0), 0);
      const expectedReturns = investments.reduce((s, inv) => s + ((inv.amount * inv.interestRate * inv.tenure) / (12 * 100)), 0);
      const realizedReturns = investments.reduce((s, inv) => s + (inv.repaidAmount || 0), 0);
      const activeInvestments = investments.filter(inv => inv.status === 'active').length;
      const avgInterest = investments.reduce((s, inv) => s + (inv.interestRate || 0), 0) / (investments.length || 1);
      setStats({ totalInvested, expectedReturns, realizedReturns, activeInvestments, averageInterest: avgInterest });
    }
  }, [investments]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderLine className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Lender Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Total Invested</p><p className="text-2xl font-bold">₹{stats.totalInvested.toLocaleString()}</p></div><WalletLine className="h-10 w-10 text-green-500" /></div>
        </div>
        <div className="bg-white rounded-xl p-5 border-l-4 border-blue-500">
          <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Expected Returns</p><p className="text-2xl font-bold text-blue-600">₹{Math.round(stats.expectedReturns).toLocaleString()}</p></div><TrendingUpLine className="h-10 w-10 text-blue-500" /></div>
        </div>
        <div className="bg-white rounded-xl p-5 border-l-4 border-purple-500">
          <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Realized Returns</p><p className="text-2xl font-bold text-purple-600">₹{Math.round(stats.realizedReturns).toLocaleString()}</p></div><MoneyCnyCircleLine className="h-10 w-10 text-purple-500" /></div>
        </div>
        <div className="bg-white rounded-xl p-5 border-l-4 border-orange-500">
          <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Active Investments</p><p className="text-2xl font-bold">{stats.activeInvestments}</p><p className="text-xs text-gray-500">Avg ROI: {stats.averageInterest.toFixed(1)}%</p></div><BriefcaseLine className="h-10 w-10 text-orange-500" /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">My Investments</h2>
        <MyInvestments investments={investments || []} loading={loading} />
      </div>
    </div>
  );
};

export default LenderDashboard;