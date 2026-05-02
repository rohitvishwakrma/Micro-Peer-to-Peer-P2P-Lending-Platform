import React from 'react';
import LoaderLine from 'remixicon-react/LoaderLine';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <LoaderLine className="h-12 w-12 text-blue-600 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;