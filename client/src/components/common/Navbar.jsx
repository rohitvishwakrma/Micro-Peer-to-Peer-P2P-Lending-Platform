import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLine from 'remixicon-react/DashboardLine';
import StoreLine from 'remixicon-react/StoreLine';
import AddLine from 'remixicon-react/AddLine';
import LogoutBoxLine from 'remixicon-react/LogoutBoxLine';
import UserLine from 'remixicon-react/UserLine';
import CoinLine from 'remixicon-react/CoinLine';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/login" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <CoinLine className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">P2P Lending</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <CoinLine className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">P2P Lending</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user?.role === 'borrower' ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <DashboardLine className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/create-loan" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <AddLine className="h-5 w-5" />
                  <span>Create Loan</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <DashboardLine className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/marketplace" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <StoreLine className="h-5 w-5" />
                  <span>Marketplace</span>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded-full">
                <UserLine className="h-4 w-4 text-gray-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogoutBoxLine className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="md:hidden flex justify-around mt-3 pt-3 border-t">
          {user?.role === 'borrower' ? (
            <>
              <Link to="/dashboard" className="flex flex-col items-center text-gray-600">
                <DashboardLine className="h-5 w-5" />
                <span className="text-xs">Home</span>
              </Link>
              <Link to="/create-loan" className="flex flex-col items-center text-gray-600">
                <AddLine className="h-5 w-5" />
                <span className="text-xs">Create</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="flex flex-col items-center text-gray-600">
                <DashboardLine className="h-5 w-5" />
                <span className="text-xs">Home</span>
              </Link>
              <Link to="/marketplace" className="flex flex-col items-center text-gray-600">
                <StoreLine className="h-5 w-5" />
                <span className="text-xs">Market</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;