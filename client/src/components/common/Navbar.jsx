import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Store, Plus, LogOut, User, Coins, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/login" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Coins className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-800">P2P Lending</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Coins className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-800">P2P Lending</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user?.role === 'borrower' ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/create-loan" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Plus className="h-5 w-5" />
                  <span>Create Loan</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/marketplace" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Store className="h-5 w-5" />
                  <span>Marketplace</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded-full">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t animate-fade-in">
            <div className="flex flex-col space-y-3">
              {user?.role === 'borrower' ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/create-loan" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Loan</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/marketplace" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100"
                  >
                    <Store className="h-5 w-5" />
                    <span>Marketplace</span>
                  </Link>
                </>
              )}
              <div className="pt-3 mt-2 border-t">
                <div className="flex items-center gap-3 py-2 px-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 mt-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;