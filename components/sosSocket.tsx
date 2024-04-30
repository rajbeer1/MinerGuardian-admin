'use client'
import { useState, useEffect } from 'react';
import socketClient from '@/helpers/socket';
import Cookies from 'js-cookie';
const useSosData = () => {
  const [sosData, setSos] = useState(() => {
    // Retrieve the initial state from localStorage or a fallback value
    const storedSos = Cookies.get('sosData');
    return storedSos
      ? JSON.parse(storedSos)
      : [
        {
          lastLat: 0,
          lastLong: 0,
          time: 'N/A',
          __v: 0,
          altitude: 0,
          email: '',
          temperature: 0,
          type: '',
        },
      ];
  });

  useEffect(() => {
    const handleSosData = (data: any) => {
      if (Array.isArray(data) && data.every((item) => item === null)) {
        return;
      }
      setSos((prevSos: any) => {
        const isDifferent = JSON.stringify(prevSos) !== JSON.stringify(data);
        if (isDifferent) {
          Cookies.set('sosData', JSON.stringify(data));
          return data;
        }
        return prevSos;
      });
      
    };

    socketClient.connect();
    socketClient.subscribeTo('SOS-admin', handleSosData);

    
  }, []);

  return {sosData, setSos
};
};

export default useSosData;
