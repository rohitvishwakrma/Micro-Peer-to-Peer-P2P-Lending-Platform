import React, { useState } from 'react';
import EyeLine from 'remixicon-react/EyeLine';
import TrendingUpLine from 'remixicon-react/TrendingUpLine';
import CloseLine from 'remixicon-react/CloseLine';
import LoaderLine from 'remixicon-react/LoaderLine';
import { format } from 'date-fns';

const MyInvestments = ({ investments, loading }) => {
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoaderLine className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!investments?.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <TrendingUpLine className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No investments yet</p>
        <p className="text-gray-400 text-sm">Browse the marketplace to start investing</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const calculateReturns = (investment) => {
    const monthlyRate = investment.interestRate / 100 / 12;
    const emi = (investment.amount * monthlyRate * Math.pow(1 + monthlyRate, investment.tenure)) / 
                (Math.pow(1 + monthlyRate, investment.tenure) - 1);
    return { totalReturns: emi * investment.tenure, totalInterest: (emi * investment.tenure) - investment.amount, monthlyEMI: Math.round(emi) };
  };

  const totalInvested = investments.reduce((s, inv) => s + inv.amount, 0);
  const totalExpectedReturns = investments.reduce((s, inv) => s + calculateReturns(inv).totalInterest, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Total Invested</p>
          <p className="text-2xl font-bold">₹{totalInvested.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Expected Returns</p>
          <p className="text-2xl font-bold">₹{Math.round(totalExpectedReturns).toLocaleString()}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Loan ID</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Interest</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tenure</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Monthly EMI</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {investments.map((inv) => {
              const { monthlyEMI } = calculateReturns(inv);
              return (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{inv._id?.slice(-8)}</td>
                  <td className="px-4 py-3 font-semibold">₹{inv.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{inv.interestRate}%</td>
                  <td className="px-4 py-3">{inv.tenure}m</td>
                  <td className="px-4 py-3">₹{monthlyEMI.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(inv.status)}`}>{inv.status}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedInvestment(inv)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <EyeLine className="h-4 w-4" /> Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b"><h3 className="text-lg font-bold">Investment Details</h3><button onClick={() => setSelectedInvestment(null)}><CloseLine className="h-5 w-5 text-gray-400" /></button></div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between"><span className="text-gray-600">Loan ID</span><span className="font-mono">{selectedInvestment._id}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Amount Invested</span><span className="font-bold">₹{selectedInvestment.amount?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Interest Rate</span><span className="text-green-600">{selectedInvestment.interestRate}% p.a.</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tenure</span><span>{selectedInvestment.tenure} months</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Monthly EMI</span><span>₹{calculateReturns(selectedInvestment).monthlyEMI.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Expected Total Returns</span><span className="text-green-600 font-bold">₹{Math.round(calculateReturns(selectedInvestment).totalReturns).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Total Interest</span><span>₹{Math.round(calculateReturns(selectedInvestment).totalInterest).toLocaleString()}</span></div>
              <button onClick={() => setSelectedInvestment(null)} className="w-full bg-gray-100 py-2 rounded-lg mt-2">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvestments;