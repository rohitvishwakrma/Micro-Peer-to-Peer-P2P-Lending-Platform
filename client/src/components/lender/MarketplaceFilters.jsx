import React from 'react';
import CloseLine from 'remixicon-react/CloseLine';
import SlidersHLine from 'remixicon-react/SlidersHLine';

const MarketplaceFilters = ({ filters, setFilters }) => {
  const handleChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ minAmount: '', maxAmount: '', minInterest: '', maxInterest: '', tenure: '', purpose: '' });
  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <SlidersHLine className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Filter Loans</h3>
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
            <CloseLine className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₹)</label>
          <div className="flex gap-2">
            <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
              <input type="number" placeholder="Min" value={filters.minAmount} onChange={(e) => handleChange('minAmount', e.target.value)}
                className="w-full pl-7 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
              <input type="number" placeholder="Max" value={filters.maxAmount} onChange={(e) => handleChange('maxAmount', e.target.value)}
                className="w-full pl-7 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (% p.a.)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" value={filters.minInterest} onChange={(e) => handleChange('minInterest', e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="number" placeholder="Max" value={filters.maxInterest} onChange={(e) => handleChange('maxInterest', e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tenure</label>
          <select value={filters.tenure} onChange={(e) => handleChange('tenure', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Any Tenure</option><option value="3">3 months</option><option value="6">6 months</option>
            <option value="12">12 months</option><option value="24">24 months</option><option value="36">36 months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loan Purpose</label>
          <select value={filters.purpose} onChange={(e) => handleChange('purpose', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Purposes</option><option value="education">Education</option><option value="medical">Medical</option>
            <option value="business">Business</option><option value="debt">Debt Consolidation</option>
            <option value="home">Home Improvement</option><option value="other">Other</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
          {filters.minAmount && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Min: ₹{parseInt(filters.minAmount).toLocaleString()}</span>}
          {filters.maxAmount && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Max: ₹{parseInt(filters.maxAmount).toLocaleString()}</span>}
          {filters.minInterest && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Min Interest: {filters.minInterest}%</span>}
          {filters.maxInterest && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Max Interest: {filters.maxInterest}%</span>}
          {filters.tenure && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Tenure: {filters.tenure}m</span>}
          {filters.purpose && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Purpose: {filters.purpose}</span>}
        </div>
      )}
    </div>
  );
};

export default MarketplaceFilters;