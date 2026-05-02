import React, { useState, useEffect } from 'react';
import { useLoans } from '../../context/LoanContext';
import LoanCard from './LoanCard';
import MarketplaceFilters from './MarketplaceFilters';
import FundLoanModal from './FundLoanModal';
import { getStripe } from '../../services/stripeService';
import { Elements } from '@stripe/react-stripe-js';
import SearchLine from 'remixicon-react/SearchLine';
import FilterLine from 'remixicon-react/FilterLine';
import AlertLine from 'remixicon-react/AlertLine';
import LoaderLine from 'remixicon-react/LoaderLine';

const stripePromise = getStripe();

const LoanMarketplace = () => {
  const { loanRequests, fetchLoanRequests, loading } = useLoans();
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ minAmount: '', maxAmount: '', minInterest: '', maxInterest: '', tenure: '', purpose: '' });
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => { fetchLoanRequests(); getStripe().then(() => setStripeReady(true)); }, []);
  useEffect(() => { filterLoans(); }, [loanRequests, searchTerm, filters]);

  const filterLoans = () => {
    let filtered = [...loanRequests];
    if (searchTerm) filtered = filtered.filter(l => l.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) || l.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filters.minAmount) filtered = filtered.filter(l => l.amount >= parseInt(filters.minAmount));
    if (filters.maxAmount) filtered = filtered.filter(l => l.amount <= parseInt(filters.maxAmount));
    if (filters.minInterest) filtered = filtered.filter(l => l.interestRate >= parseInt(filters.minInterest));
    if (filters.maxInterest) filtered = filtered.filter(l => l.interestRate <= parseInt(filters.maxInterest));
    if (filters.tenure) filtered = filtered.filter(l => l.tenure === parseInt(filters.tenure));
    if (filters.purpose) filtered = filtered.filter(l => l.purpose === filters.purpose);
    setFilteredLoans(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoaderLine className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-gray-800">Loan Marketplace</h2><p className="text-gray-500">Browse and fund loans from borrowers</p></div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
          <FilterLine className="h-5 w-5" /> Filters
        </button>
      </div>
      
      <div className="relative">
        <SearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input type="text" placeholder="Search by purpose or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
      </div>
      
      {showFilters && <MarketplaceFilters filters={filters} setFilters={setFilters} />}
      
      {filteredLoans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <AlertLine className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No loans found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.map(loan => <LoanCard key={loan._id} loan={loan} onFund={() => setSelectedLoan(loan)} />)}
        </div>
      )}
      
      {selectedLoan && stripeReady && (
        <Elements stripe={stripePromise}>
          <FundLoanModal loan={selectedLoan} onClose={() => { setSelectedLoan(null); fetchLoanRequests(); }} onSuccess={() => { setSelectedLoan(null); fetchLoanRequests(); }} />
        </Elements>
      )}
    </div>
  );
};

export default LoanMarketplace;