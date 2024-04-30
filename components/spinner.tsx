import React from 'react';

export const Spinner = () => (
  <div className="relative inline-block w-6 h-6">
    <div
      className="absolute w-5 h-5 border-2 border-blue-500 rounded-full animate-spin"
      style={{
        animation: 'spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        borderColor: '#3b82f6 transparent transparent transparent',
      }}
    ></div>
    <div
      className="absolute w-5 h-5 border-2 border-blue-500 rounded-full animate-spin"
      style={{
        animation: 'spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        borderColor: '#3b82f6 transparent transparent transparent',
        animationDelay: '-0.45s',
      }}
    ></div>
    <div
      className="absolute w-5 h-5 border-2 border-blue-500 rounded-full animate-spin"
      style={{
        animation: 'spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        borderColor: '#3b82f6 transparent transparent transparent',
        animationDelay: '-0.3s',
      }}
    ></div>
    <div
      className="absolute w-5 h-5 border-2 border-blue-500 rounded-full animate-spin"
      style={{
        animation: 'spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        borderColor: '#3b82f6 transparent transparent transparent',
        animationDelay: '-0.15s',
      }}
    ></div>
  </div>
);
