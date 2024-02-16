import React from 'react';

const LoadingRings = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin">
        <div className="ring bg-white border-8 border-gray-200"></div>
      </div>
      <div className="animate-spin delay-100">
        <div className="ring bg-gray-200 border-8 border-gray-400"></div>
      </div>
      <div className="animate-spin delay-200">
        <div className="ring bg-gray-400 border-8 border-gray-600"></div>
      </div>
      <div className="animate-spin delay-300">
        <div className="ring bg-gray-600 border-8 border-gray-800"></div>
      </div>
    </div>
  );
};

export default LoadingRings;
