import React, { useState, useEffect } from 'react';

const FloatingAudioButton = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setTimeout(() => {
        setIsActive(false);
      }, 15000); // 15 seconds
    }
    return () => clearTimeout(timer);
  }, [isActive]);

  const handleClick = () => {
    if (!isActive) {
      setIsActive(true);
      // Add your audio functionality here
    }
  };
  
  return (
    <div className="relative">
      <button 
        className={`ml-4 mr-2 bg-gradient-to-r from-green-300 to-white rounded-full w-4 h-4 flex items-center justify-center text-white text-xl md:w-8 md:h-8 md:text-2xl shadow-lg focus:outline-none transition-all duration-300 ease-in-out z-50 transform hover:shadow-xl hover:scale-150 hover:bg-green-400 ${isActive ? 'shadow-2xl' : ''}`}
        onClick={handleClick}
      >
        {isActive && (
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></span>
        )}
        <span className="relative z-10 text-white">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/6190/6190938.png" 
            alt="headphones"
            className="w-4 h-4 md:w-6 md:h-6"
          />
        </span>
      </button>
    </div>
  );
};

export default FloatingAudioButton;