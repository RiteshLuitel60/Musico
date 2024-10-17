import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const Notification = ({ 
  message, 
  isVisible,  
  type = 'info',
  onClose
}) => {
  useEffect(() => {
    if (isVisible) {
      // Set a timer to close the notification after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      // Clear the timer if the component unmounts or isVisible changes
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // If the notification is not visible, don't render anything
  if (!isVisible) return null;

  // Icons for different types of notifications
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  // Colors for different types of notifications
  const colors = {
    success: 'border-green-500/20 bg-green-500/10',
    error: 'border-red-500/20 bg-red-500/10',
    info: 'border-blue-500/20 bg-blue-500/10'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`
        flex items-center gap-3 min-w-[320px] max-w-md
        border ${colors[type]}
        px-4 py-3 rounded-lg shadow-lg
        bg-black
        backdrop-blur-md bg-opacity-90
        transform transition-all duration-300 ease-out
      `}>
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        
        <p className="text-sm text-white flex-grow">
          {message}
        </p>

        
      </div>
    </div>
  );
};

export default Notification;