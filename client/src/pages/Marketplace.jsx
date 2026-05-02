import React, { useEffect } from 'react';
import { useLoans } from '../context/LoanContext';
import LoanMarketplace from '../components/lender/LoanMarketplace';
import LoaderLine from 'remixicon-react/LoaderLine';

const Marketplace = () => {
  const { fetchLoanRequests, loading } = useLoans();

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderLine className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return <LoanMarketplace />;
};

export default Marketplace;