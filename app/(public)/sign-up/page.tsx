'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosClient from '@/helpers/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
export default function LoginAccount() {
  const router = useRouter();
  const [data, setdata] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [remember, setremember] = useState(0);
  const [isloading, setisloading] = useState(false);
  function setCookie(name: string, value: string, days: number) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie =
      name +
      '=' +
      (encodeURIComponent(value) || '') +
      expires +
      '; path=/; Secure; SameSite=None;';
  }
  const submit = async () => {
    try {
      setisloading(true);
      const user = await axiosClient.post('/auth/admin/signup', data);
      console.log(user);
      toast.success('successfully signed in');
      if (remember === 0) {
        setCookie('admin', user.data.token, 0.1);
      } else {
        setCookie('admin', user.data.token, 2);
      }

      router.push('/home');
      setisloading(true);
    } catch (error: any) {
const erro = error.response.data.message || error?.message || 'error';

      toast.error(erro);

      setisloading(false);
    } finally {
      setisloading(false);
    }
  };
  console.log(data);

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="w-full m-auto bg-white lg:max-w-lg">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
          }}
        ></Toaster>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign up</CardTitle>
            <CardDescription className="text-center font-bold text-black">
              Welcome to MinerGuardian ADMIN panel
            </CardDescription>
            <CardDescription className="text-center">
              Enter your information to Sign up
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="name"
                placeholder=""
                onChange={(e) => {
                  setdata({ ...data, name: e.target.value });
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                onChange={(e) => {
                  setdata({ ...data, email: e.target.value });
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                onChange={(e) => {
                  setdata({ ...data, password: e.target.value });
                }}
              />
            </div>
           
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                onCheckedChange={(checked) => {
                  if (checked === false) {
                    setremember(0);
                  } else if (checked === true) {
                    setremember(1);
                  }
                  console.log(remember);
                }}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button disabled={isloading} className="w-full" onClick={submit}>
              Signup
            </Button>
            <p className="mt-2 text-xs text-center text-gray-700">
              {' '}
              have an account?{' '}
              <span className=" text-blue-600 hover:underline">
                <Link href="/">Log in</Link>
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
