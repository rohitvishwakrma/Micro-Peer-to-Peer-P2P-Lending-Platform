import React, { useState } from 'react';
import RepaymentModal from './RepaymentModal';
import { format } from 'date-fns';
import LoaderLine from 'remixicon-react/LoaderLine';

const MyLoans = ({ loans, loading }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoaderLine className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!loans?.length) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <p className="text-gray-500">No active loans</p>
        <p className="text-gray-400 text-sm mt-1">Create a loan request to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-4 border-b"><h2 className="text-xl font-semibold">My Active Loans</h2></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Loan ID</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Outstanding</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Interest</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Next Payment</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loans.map(loan => (
              <tr key={loan._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono">{loan._id?.slice(-6)}</td>
                <td className="px-4 py-3 font-semibold">₹{loan.amount?.toLocaleString()}</td>
                <td className="px-4 py-3">₹{(loan.amount - (loan.repaidAmount || 0))?.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-600">{loan.interestRate}%</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(loan.status)}`}>{loan.status}</span></td>
                <td className="px-4 py-3 text-sm">{loan.nextRepaymentDate ? format(new Date(loan.nextRepaymentDate), 'dd MMM yyyy') : '-'}</td>
                <td className="px-4 py-3">
                  {loan.status === 'active' && (
                    <button onClick={() => { setSelectedLoan(loan); setShowModal(true); }} className="text-blue-600 hover:text-blue-800 font-medium">
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && selectedLoan && <RepaymentModal loan={selectedLoan} onClose={() => { setShowModal(false); setSelectedLoan(null); }} />}
    </div>
  );
};

export default MyLoans;