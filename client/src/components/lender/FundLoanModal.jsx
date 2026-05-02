import React, { useState } from 'react';
import { useLoans } from '../../context/LoanContext';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CloseLine from 'remixicon-react/CloseLine';
import BankCardLine from 'remixicon-react/BankCardLine';
import AlertLine from 'remixicon-react/AlertLine';
import LoaderLine from 'remixicon-react/LoaderLine';

const FundLoanModal = ({ loan, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const { fundLoan, fetchLoanRequests } = useLoans();

  const remainingAmount = loan.amount - (loan.fundedAmount || 0);

  const calculateEMI = () => {
    const P = parseFloat(amount) || 0;
    const r = loan.interestRate / 100 / 12;
    const n = loan.tenure;
    if (P === 0) return 0;
    if (r === 0) return P / n;
    return Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');
    try {
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
      if (stripeError) throw new Error(stripeError.message);
      await fundLoan(loan._id, parseFloat(amount), paymentMethod.id);
      await fetchLoanRequests();
      onSuccess();
      onClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">Fund This Loan</h2>
          <button onClick={onClose}><CloseLine className="h-6 w-6 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between"><span className="text-gray-600">Loan Amount</span><span className="font-semibold">₹{loan.amount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Interest Rate</span><span className="font-semibold text-green-600">{loan.interestRate}% p.a.</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Tenure</span><span className="font-semibold">{loan.tenure} months</span></div>
            <div className="flex justify-between pt-2 border-t"><span className="text-gray-600">Remaining to Fund</span><span className="font-bold text-blue-600">₹{remainingAmount.toLocaleString()}</span></div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Your Investment Amount</label>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" required min="5000" max={remainingAmount} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Min: ₹5,000 | Max: ₹{remainingAmount.toLocaleString()}</p>
          </div>

          {amount > 0 && (
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-sm text-gray-600">Your Expected Monthly Return</p>
              <p className="text-2xl font-bold text-green-600">₹{calculateEMI().toLocaleString()}</p>
              <p className="text-xs text-gray-500">For {loan.tenure} months at {loan.interestRate}% interest</p>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">Card Details</label>
            <div className="border rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <CardElement options={{ hidePostalCode: true, style: { base: { fontSize: '16px', color: '#1f2937' } } }} />
            </div>
          </div>

          {error && <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"><AlertLine className="h-4 w-4" />{error}</div>}

          <button type="submit" disabled={!stripe || loading || !amount}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2">
            {loading ? <><LoaderLine className="h-5 w-5 animate-spin" /> Processing...</> : <><BankCardLine className="h-5 w-5" /> Invest ₹{parseFloat(amount || 0).toLocaleString()}</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FundLoanModal;