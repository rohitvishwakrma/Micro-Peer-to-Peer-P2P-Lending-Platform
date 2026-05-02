import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLine from 'remixicon-react/DashboardLine';
import StoreLine from 'remixicon-react/StoreLine';
import AddLine from 'remixicon-react/AddLine';
import WalletLine from 'remixicon-react/WalletLine';
import TrendingUpLine from 'remixicon-react/TrendingUpLine';
import SettingsLine from 'remixicon-react/SettingsLine';
import LogoutBoxLine from 'remixicon-react/LogoutBoxLine';
import CoinLine from 'remixicon-react/CoinLine';
import NotificationLine from 'remixicon-react/NotificationLine';
import HistoryLine from 'remixicon-react/HistoryLine';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const borrowerLinks = [
    { path: '/dashboard', icon: DashboardLine, label: 'Dashboard' },
    { path: '/create-loan', icon: AddLine, label: 'Create Loan' },
    { path: '/my-loans', icon: WalletLine, label: 'My Loans' },
    { path: '/repayment-history', icon: HistoryLine, label: 'Repayment History' },
    { path: '/notifications', icon: NotificationLine, label: 'Notifications' },
    { path: '/settings', icon: SettingsLine, label: 'Settings' },
  ];

  const lenderLinks = [
    { path: '/dashboard', icon: DashboardLine, label: 'Dashboard' },
    { path: '/marketplace', icon: StoreLine, label: 'Marketplace' },
    { path: '/my-investments', icon: TrendingUpLine, label: 'My Investments' },
    { path: '/notifications', icon: NotificationLine, label: 'Notifications' },
    { path: '/settings', icon: SettingsLine, label: 'Settings' },
  ];

  const links = user?.role === 'borrower' ? borrowerLinks : lenderLinks;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:w-64 md:shadow-sm
      `}>
        <div className="flex items-center gap-2 p-5 border-b">
          <div className="bg-blue-600 p-2 rounded-lg">
            <CoinLine className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">P2P Lending</span>
        </div>

        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <span className="text-blue-600 font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <button
            onClick={() => { logout(); onClose?.(); }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogoutBoxLine className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;