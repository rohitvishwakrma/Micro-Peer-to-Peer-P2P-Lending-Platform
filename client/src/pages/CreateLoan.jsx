import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoans } from '../context/LoanContext';
import ArrowLeftLine from 'remixicon-react/ArrowLeftLine';
import MoneyCnyCircleLine from 'remixicon-react/MoneyCnyCircleLine';
import CalendarLine from 'remixicon-react/CalendarLine';
import PercentLine from 'remixicon-react/PercentLine';
import BriefcaseLine from 'remixicon-react/BriefcaseLine';
import FileTextLine from 'remixicon-react/FileTextLine';
import InformationLine from 'remixicon-react/InformationLine';
import LoaderLine from 'remixicon-react/LoaderLine';
import GraduationCapLine from 'remixicon-react/GraduationCapLine';
import HospitalLine from 'remixicon-react/HospitalLine';
import BankLine from 'remixicon-react/BankLine';
import HomeLine from 'remixicon-react/HomeLine';
import FileListLine from 'remixicon-react/FileListLine';

const CreateLoan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ amount: '', tenure: 12, interestRate: 12, purpose: '', description: '' });
  const [loading, setLoading] = useState(false);
  const { createLoanRequest, fetchMyLoans } = useLoans();

  const calculateEMI = () => {
    const P = parseFloat(formData.amount) || 0;
    const r = (parseFloat(formData.interestRate) / 100) / 12;
    const n = parseInt(formData.tenure) || 1;
    if (P === 0 || r === 0) return 0;
    return Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  const totalPayable = calculateEMI() * (parseInt(formData.tenure) || 1);
  const totalInterest = totalPayable - (parseFloat(formData.amount) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLoanRequest({ ...formData, amount: parseFloat(formData.amount), tenure: parseInt(formData.tenure), interestRate: parseFloat(formData.interestRate) });
      await fetchMyLoans();
      navigate('/dashboard');
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const purposeOptions = [
    { value: 'education', label: 'Education', icon: GraduationCapLine },
    { value: 'medical', label: 'Medical Emergency', icon: HospitalLine },
    { value: 'business', label: 'Business Expansion', icon: BriefcaseLine },
    { value: 'debt', label: 'Debt Consolidation', icon: BankLine },
    { value: 'home', label: 'Home Improvement', icon: HomeLine },
    { value: 'other', label: 'Other', icon: FileListLine },
  ];

  const getPurposeIcon = (value) => {
    const option = purposeOptions.find(opt => opt.value === value);
    if (option && option.icon) {
      const Icon = option.icon;
      return <Icon className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-blue-600">
        <ArrowLeftLine className="h-5 w-5" /> Back to Dashboard
      </button>
      
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Request a Loan</h1>
        <p className="text-gray-500 mb-6">Fill in the details to create a loan request</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Loan Amount (₹)</label>
            <div className="relative">
              <MoneyCnyCircleLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="10,000" required min="10000" max="500000" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Min: ₹10,000 | Max: ₹5,00,000</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Tenure (months)</label>
            <div className="relative">
              <CalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select value={formData.tenure} onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border rounded-xl appearance-none focus:ring-2 focus:ring-blue-500">
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
                <option value={24}>24 months</option>
                <option value={36}>36 months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Interest Rate (% p.a.)</label>
            <div className="relative">
              <PercentLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="number" value={formData.interestRate} onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" step="0.5" min="8" max="36" required />
            </div>
            <input type="range" min="8" max="36" step="0.5" value={formData.interestRate}
              onChange={(e) => setFormData({...formData, interestRate: e.target.value})} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>8% (Low risk)</span><span>22%</span><span>36% (High risk)</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Loan Purpose</label>
            <div className="relative">
              <BriefcaseLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select 
                value={formData.purpose} 
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border rounded-xl appearance-none focus:ring-2 focus:ring-blue-500" 
                required
              >
                <option value="">Select purpose</option>
                {purposeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {formData.purpose && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                {getPurposeIcon(formData.purpose)}
                <span>Selected: {purposeOptions.find(opt => opt.value === formData.purpose)?.label}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description (Optional)</label>
            <div className="relative">
              <FileTextLine className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Tell lenders why you need this loan..." />
            </div>
          </div>

          {formData.amount && formData.amount > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <InformationLine className="h-5 w-5 text-blue-600" />
                <p className="font-semibold text-gray-700">Loan Summary</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-gray-500">Monthly EMI</p><p className="text-xl font-bold text-blue-600">₹{calculateEMI().toLocaleString()}</p></div>
                <div><p className="text-gray-500">Total Interest</p><p className="font-semibold">₹{totalInterest.toLocaleString()}</p></div>
                <div><p className="text-gray-500">Total Payable</p><p className="font-semibold">₹{totalPayable.toLocaleString()}</p></div>
                <div><p className="text-gray-500">Interest Rate</p><p className="font-semibold">{formData.interestRate}% p.a.</p></div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold flex items-center justify-center gap-2">
            {loading ? <><LoaderLine className="h-5 w-5 animate-spin" /> Submitting...</> : 'Submit Loan Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoan;