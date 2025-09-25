import React from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

const AlertModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = "info", // "success", "error", "warning", "info"
  buttonText = "OK" 
}) => {
  if (!isOpen) return null;

  const alertTypes = {
    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      titleColor: "text-green-900",
      buttonStyle: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:ring-green-500"
    },
    error: {
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      buttonStyle: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500"
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-900",
      buttonStyle: "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 focus:ring-yellow-500"
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
      buttonStyle: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500"
    }
  };

  const currentType = alertTypes[type];
  const IconComponent = currentType.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${currentType.iconBg} rounded-full flex items-center justify-center mr-3`}>
              <IconComponent className={`w-6 h-6 ${currentType.iconColor}`} />
            </div>
            <h3 className={`text-xl font-semibold ${currentType.titleColor}`}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed text-base">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className={`px-8 py-3 text-sm font-medium text-white border-0 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 ${currentType.buttonStyle}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;