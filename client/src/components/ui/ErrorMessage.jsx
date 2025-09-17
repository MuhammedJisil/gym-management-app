import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 ${className}`}>
      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
      <p className="text-red-800 text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;