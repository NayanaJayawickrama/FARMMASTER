import React from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const PopupMessage = ({ 
  isOpen, 
  onClose, 
  type = 'info', 
  title, 
  message, 
  showCloseButton = true,
  autoClose = false,
  autoCloseDelay = 3000 
}) => {
  React.useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, isOpen, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-500 text-2xl" />;
      case 'error':
        return <FiXCircle className="text-red-500 text-2xl" />;
      case 'warning':
        return <FiAlertCircle className="text-yellow-500 text-2xl" />;
      default:
        return <FiAlertCircle className="text-blue-500 text-2xl" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 border-2 ${getColorClasses()}`}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        )}
        
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {title}
                </h3>
              )}
              <p className="text-gray-700 text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupMessage;