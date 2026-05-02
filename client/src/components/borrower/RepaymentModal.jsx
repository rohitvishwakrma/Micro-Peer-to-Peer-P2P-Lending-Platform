import React, { useState } from 'react';
import { useLoans } from '../../context/LoanContext';
import CloseLine from 'remixicon-react/CloseLine';
import BankCardLine from 'remixicon-react/BankCardLine';
import LoaderLine from 'remixicon-react/LoaderLine';

const RepaymentModal = ({ loan, onClose }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { makeRepayment, fetchMyLoans } = useLoans();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await makeRepayment(loan._id, parseFloat(amount), 'pm_card_visa');
      await fetchMyLoans();
      onClose();
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const outstanding = loan.amount - (loan.repaidAmount || 0);
  const minPayment = loan.repaymentSchedule?.find(i => i.status === 'pending')?.emiAmount || outstanding;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">Make Repayment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseLine className="h-6 w-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div><label className="block text-gray-700 text-sm font-medium mb-1">Loan ID</label><input type="text" value={loan._id?.slice(-8)} disabled className="w-full p-3 bg-gray-100 rounded-lg font-mono" /></div>
          <div><label className="block text-gray-700 text-sm font-medium mb-1">Outstanding Amount</label><p className="text-2xl font-bold text-blue-600">₹{outstanding.toLocaleString()}</p></div>
          <div><label className="block text-gray-700 text-sm font-medium mb-1">Amount to Pay</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Min: ₹${minPayment.toLocaleString()}`} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500" required min={minPayment} max={outstanding} /></div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 flex items-center justify-center gap-2 font-semibold">
            {loading ? <><LoaderLine className="h-5 w-5 animate-spin" /> Processing...</> : <><BankCardLine className="h-5 w-5" /> Pay Now</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RepaymentModal;