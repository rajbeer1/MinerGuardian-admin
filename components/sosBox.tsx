import axiosClient from '@/helpers/axios';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import useSosData from './sosSocket';
import Cookies from 'js-cookie';
import { useState } from 'react';
import Loader from './loader';
import { Spinner } from './spinner';
export const SosInfoBox = () => {
  const { sosData, setSos } = useSosData();
  const [load,setload]= useState(false)
  const getdata = async () => {
    try {
       setload(true)
      const data = await axiosClient.get('/sos', {
        headers: {
          Authorization: `Bearer ${Cookies.get('admin')}`,
        },
      });
      setSos(data.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setload(false)
    }
  };
  console.log(sosData);
   if (sosData[0]?.lastLat === 0) {
     return (
       <div className="flex flex-col justify-center items-center">
         <h1 className="text-2xl font-bold mb-4">No SOS Data</h1>
         <Button onClick={getdata} disabled={load}>
           {load ? <Spinner/>: 'Refresh'}
         </Button>
       </div>
     );
   }
  const router = useRouter();
  // Inline CSS for styling the boxes and highlighting the email
  const boxStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    margin: '10px auto', // Adjusted to center the boxes
    backgroundColor: '#f9f9f9',
    width: '90%', // Adjust this value as needed
    maxWidth: '600px', // Optional: set a max-width for larger screens
    boxSizing: 'border-box', // Ensures padding is included in width calculation
  };

  const emailStyle = {
    color: '#007bff',
    fontWeight: 'bold',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%', // Ensures the container takes the full width
  };

  return (
    <div style={containerStyle}>
      {sosData.map((data:any, index:any) => (
        <div key={index} style={boxStyle}>
          <div style={emailStyle}>{data.email}</div>
          <div>Last Latitude: {data.lastLat}</div>
          <div>Last Longitude: {data.lastLong}</div>
          <div>Time: {new Date(data.time).toLocaleString()}</div>
          <div>Temperature: {data.temperature}°C</div>
          <div>Altitude: {data.altitude} meters</div>
          <Button
            className="mt-2"
            onClick={async () => {
              const req = await axiosClient.post('/sos/update', {
                email: data.email,
                time: data.time,
              });
              router.push('/');
            }}
          >
            Resolve
          </Button>
        </div>
      ))}
    </div>
  );
};
