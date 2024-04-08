'use client';
import Link from 'next/link';
import Avatar from 'react-avatar';
import sockerclient from '@/helpers/socket';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { SosInfoBox } from './sosBox';
import { jwtDecode } from '@/helpers/jwt';
import axiosClient from '@/helpers/axios';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

const Navbar = () => {
  const router = useRouter();
  const [sos, setsos] = useState([
    {
      lastLat: 0,
      lastLong: 0,
      time: "N/A",
      __v: 0,
      altitude: 0,
      email: "",
      temperature: 0,
      type: "",
    },
  ])
  const getsos = async () => {
    sockerclient.connect()
    sockerclient.subscribeTo('SOS-admin', (data: any) => {
      console.log(data)
      if (
        Array.isArray(data) &&
        data.every((item) => item === null)
      ) {
        console.log('dd');
        return;
      }
      setsos(data);
    })
    
    
  }
  useEffect(() => {
    getsos()
  }, [])
  useEffect(() => {
    console.log(sos)
  },[sos])

  const logout = () => {
    try {
      Cookies.remove('user');
      router.refresh();
    } catch (error) {
      toast.error('error while logging out');
    }
  };
  const data = jwtDecode();
  return (
    <div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 10000,
        }}
      ></Toaster>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-around',

          background: '#D1D5DB',
          position: 'fixed',
          height: '60px',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
        }}
      >
        <Link href="/home">
          <div
            className="text-xl font-medium hover:text-violet-600 "
            style={{ padding: '1rem' }}
          >
            Home
          </div>
        </Link>
        <Link href="/photo">
          <div
            className="text-xl font-medium hover:text-violet-600"
            style={{ padding: '1rem' }}
          >
            imaging
          </div>
        </Link>
        <Link href="/map">
          <div
            className="text-xl font-medium hover:text-violet-600"
            style={{ padding: '1rem' }}
          >
            Map
          </div>
        </Link>
        <Dialog>
          <DialogTrigger>
            <div
              className="text-xl font-medium hover:text-violet-600"
              style={{ padding: '1rem' }}
            >
              SOS
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>SOS</DialogTitle>
              <DialogDescription className="font-semibold">
                <ScrollArea className="h-[300px] w-[400px] rounded-md border p-4 overflow-auto">
                  <SosInfoBox sosData={sos} />
                </ScrollArea>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-center w-full p-4">
              <DialogClose>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-4 w-full rounded"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <Avatar
              size="50px"
              className="rounded-lg hover:cursor-pointer "
              style={{ padding: '0.2rem' }}
              name={data?.id}
            ></Avatar>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log out</DialogTitle>
              <DialogDescription className="font-semibold">
                Do you want to logout
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="sm:justify-start">
              <DialogClose>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={logout}
                  className="text-red-600"
                >
                  Yes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>
    </div>
  );
};

export default Navbar;
