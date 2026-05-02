import React, { useEffect } from 'react';
import CloseLine from 'remixicon-react/CloseLine';
import CheckboxCircleLine from 'remixicon-react/CheckboxCircleLine';
import AlertLine from 'remixicon-react/AlertLine';
import InformationLine from 'remixicon-react/InformationLine';
import ErrorWarningLine from 'remixicon-react/ErrorWarningLine';

const ToastNotification = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckboxCircleLine className="h-5 w-5 text-green-500" />,
    error: <ErrorWarningLine className="h-5 w-5 text-red-500" />,
    warning: <AlertLine className="h-5 w-5 text-yellow-500" />,
    info: <InformationLine className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  return (
    <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg border ${bgColors[type]} ${textColors[type]} min-w-[300px] animate-slide-in`}>
      {icons[type]}
      <p className="flex-1 text-sm">{message}</p>
      <button onClick={onClose} className="hover:opacity-70">
        <CloseLine className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ToastNotification;