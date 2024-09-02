import React from 'react';
import { logo } from './images'; // Ensure you import your logo image

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="animate-pulse">
        <img src={logo} alt="Logo" className="w-32 h-32" />
      </div>
    </div>
  );
};

export default LoadingScreen;
