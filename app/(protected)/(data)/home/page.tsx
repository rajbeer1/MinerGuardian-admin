'use client';
import React, { useEffect, useState } from 'react';
import axiosClient from '@/helpers/axios';
import Loader from '@/components/loader';
import MinersView from '@/components/miners';
import Cookies from 'js-cookie';
const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [miners, setMiners] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get('/data/miners', {
        headers: {
          Authorization: `Bearer ${Cookies.get('admin')}`,
        },
      });
      setMiners(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="flex justify-center bg-slate-900 min-h-screen">
      <div className="w-full p-4">
        <MinersView miners={miners} />

      </div>
    </div>
  );
};

export default AdminDashboard;
