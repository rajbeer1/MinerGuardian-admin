// Navbar.jsx
import Link from 'next/link';
import Avatar from 'react-avatar';
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
import { ScrollArea } from '@radix-ui/react-scroll-area';

import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { SosInfoBox } from './sosBox';
import { jwtDecode } from '@/helpers/jwt';
import useSosData from './sosSocket';
import React, { useEffect, useState } from 'react';
import axiosClient from '@/helpers/axios';
const Navbar = () => {
  const router = useRouter();
  const [email, setemail] = useState('');
  const data = jwtDecode();

  const logout = () => {
    try {
      Cookies.remove('admin');
      Cookies.remove('sosData');
      router.refresh();
    } catch (error) {
      toast.error('error while logging out');
    }
  };

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
          <DialogContent className="sm:max-w-md bg-gradient-to-r from-purple-200 to-indigo-200 ">
            <DialogHeader>
              <DialogTitle className="flex justify-center">SOS</DialogTitle>
              <DialogDescription className="font-semibold ">
                <ScrollArea className="h-[400px] w-[400px] rounded-md border  overflow-auto">
                  <SosInfoBox />
                </ScrollArea>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <div
              className="text-xl font-medium hover:text-violet-600 "
              style={{ padding: '1rem' }}
            >
              Invite
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="py-4 flex justify-center font-semibold text-3xl">
                Invite
              </DialogTitle>
              <DialogDescription className="font-semibold">
                <div className="flex flex-col space-y-4">
                  <div>
                    <input
                      type="email"
                      id="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                      placeholder="Enter email address"
                      onChange={(e) => {
                        setemail(e.target.value);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={async () => {
                      try {
                        const response = await axiosClient.post(
                          'auth/admin/invite',
                          {
                            email,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${Cookies.get('admin')}`,
                            },
                          }
                        );

                        console.log(response.data);

                        toast.success('invite has been sent ');
                      } catch (error) {
                        console.error('Error:', error);
                        toast.error('error in sending the invite');
                      }
                    }}
                  >
                    Send Invite
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
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

export default React.memo(Navbar);
