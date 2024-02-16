'use client';
import Navbar from '@/components/navbar';
import SocketClient from '@/helpers/socket';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import axiosClient from '@/helpers/axios';
export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <div>
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 10000,
        }}
      ></Toaster>
      <div className="mt-[60px]">{children}</div>
    </div>
  );
}
