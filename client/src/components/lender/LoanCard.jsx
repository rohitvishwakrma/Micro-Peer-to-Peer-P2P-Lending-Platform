import React from 'react';
import TrendingUpLine from 'remixicon-react/TrendingUpLine';
import CalendarLine from 'remixicon-react/CalendarLine';
import MoneyCnyCircleLine from 'remixicon-react/MoneyCnyCircleLine';
import TimeLine from 'remixicon-react/TimeLine';
import UserStarLine from 'remixicon-react/UserStarLine';
import ShieldLine from 'remixicon-react/ShieldLine';
import { formatDistanceToNow } from 'date-fns';

const purposeIcons = { education: '📚', medical: '🏥', business: '💼', debt: '💰', home: '🏠', other: '📝' };

const LoanCard = ({ loan, onFund }) => {
  const calculateEMI = () => {
    const P = loan.amount;
    const r = loan.interestRate / 100 / 12;
    const n = loan.tenure;
    if (P === 0 || r === 0) return P / n;
    return Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  const monthlyEMI = calculateEMI();
  const fundedPercentage = (loan.fundedAmount / loan.amount) * 100;
  const daysLeft = Math.ceil((new Date(loan.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
  const totalInterest = (monthlyEMI * loan.tenure) - loan.amount;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg">{purposeIcons[loan.purpose]}</span>
            <span className="text-white text-sm font-medium">{loan.purpose?.toUpperCase()}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${daysLeft > 7 ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
            {daysLeft > 0 ? `${daysLeft} days left` : 'Expiring soon'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <p className="text-gray-500 text-sm">Loan Amount</p>
          <p className="text-2xl font-bold text-gray-800">₹{loan.amount.toLocaleString()}</p>
          {loan.fundedAmount > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Funded: ₹{loan.fundedAmount.toLocaleString()}</span>
                <span>{Math.round(fundedPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${fundedPercentage}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-1.5 rounded-lg"><TrendingUpLine className="h-3 w-3 text-green-600" /></div>
            <div><p className="text-xs text-gray-500">Interest Rate</p><p className="font-semibold text-sm">{loan.interestRate}% p.a.</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-lg"><CalendarLine className="h-3 w-3 text-blue-600" /></div>
            <div><p className="text-xs text-gray-500">Tenure</p><p className="font-semibold text-sm">{loan.tenure} months</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-1.5 rounded-lg"><MoneyCnyCircleLine className="h-3 w-3 text-purple-600" /></div>
            <div><p className="text-xs text-gray-500">Monthly EMI</p><p className="font-semibold text-sm">₹{monthlyEMI.toLocaleString()}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-1.5 rounded-lg"><TimeLine className="h-3 w-3 text-orange-600" /></div>
            <div><p className="text-xs text-gray-500">Posted</p><p className="font-semibold text-xs">{formatDistanceToNow(new Date(loan.createdAt), { addSuffix: true })}</p></div>
          </div>
        </div>

        {loan.description && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Borrower Note:</p>
            <p className="text-gray-600 text-sm line-clamp-2">{loan.description}</p>
          </div>
        )}

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-600">Your Expected Returns</p>
          <p className="text-xl font-bold text-green-600">₹{totalInterest.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total interest over {loan.tenure} months</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <ShieldLine className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-400">Risk: </span>
            {loan.interestRate < 15 ? <span className="text-xs text-green-600">Low</span> : loan.interestRate < 25 ? <span className="text-xs text-yellow-600">Medium</span> : <span className="text-xs text-red-600">High</span>}
          </div>
          <div className="flex items-center gap-1">
            <UserStarLine className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-400">Individual</span>
          </div>
        </div>

        <button onClick={onFund} disabled={fundedPercentage >= 100}
          className={`w-full py-2.5 rounded-lg font-semibold transition ${fundedPercentage >= 100 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
          {fundedPercentage >= 100 ? '✓ Fully Funded' : '💸 Fund This Loan'}
        </button>
      </div>
    </div>
  );
};

export default LoanCard;