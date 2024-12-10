'use client';
import axiosClient from '@/helpers/axios';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
  Libraries,
} from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '@/components/loader';
import { jwtDecode } from '@/helpers/jwt';
import Link from 'next/link';
import { IoArrowForwardOutline } from 'react-icons/io5';

function Home() {
  const libraries: Libraries = ['visualization'] as const;
  const [isloading, setisloading] = useState(false);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAN6b_-hDFORuqIbR3NITLQOv9L8IMmHzs',
    libraries,
  });
  const [cordData, setcordData] = useState([
    { latitude: 0, longitude: 0, email: '' },
  ]);
  const [useremail, setuseremail] = useState('');
  const getdata = async () => {
    try {
      setisloading(true);
      const token = Cookies.get('admin');
      const payload = jwtDecode();
      setuseremail(payload?.email!);
      const data = await axiosClient.get('/data/cords/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setcordData(data.data);
      setisloading(false);
    } catch (error) {
      toast.error('error loading the map');
      setisloading(false);
    } finally {
      setisloading(false);
    }
  };
  useEffect(() => {
    getdata();
  }, []);

  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const handleActiveMarker = (marker: any) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };
  if (loadError) {
    return <div>Error loading the map</div>;
  }

  if (!isLoaded) {
    return <div><Loader/></div>;
  }
  
  console.log(cordData)
  function calculateCenter(data: any) {
    let sumLat = 0;
    let sumLng = 0;
    let count = 0;

    data.forEach((item: { latitude: number; longitude: number }) => {
      sumLat += item.latitude;
      sumLng += item.longitude;
      count++;
    });

    return {
      lat: sumLat / count,
      lng: sumLng / count,
    };
  }

  const center = calculateCenter(cordData);
  if (isloading)
    return (
      <>
        <Loader/>
      </>
    );
  if (cordData.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Insufficient Proper Data</h2>
          <p className="text-gray-600 mb-6">
            The data for your specific device is insufficient. Please ensure
            that your hardware device is turned on and try again later.
          </p>
          <button
            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300"
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }
  return (
    <main className="relative w-full h-[calc(100vh-64px)]">
      {' '}
      <GoogleMap
        mapContainerStyle={{
          height: '100%',
          width: '100%',
        }}
        zoom={10}
        onLoad={(loadedmap) => setMap(map)}
        center={center}
      >
        {cordData.map((data, index) => (
          <Marker
            key={index}
            position={{ lat: data.latitude, lng: data.longitude }}
            onClick={() => handleActiveMarker(index)}
            icon={{
              url:
                data.email === useremail
                  ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
          >
            {activeMarker === index ? (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div>
                  <h2>{data.email}</h2>
                  <p>Latitude: {data.latitude}</p>
                  <p>Longitude: {data.longitude}</p>
                  <Link href={`/graph/${data.email}`}>
                    <span className=" text-md font-bold flex items-center gap-2 mt-1 cursor-pointer">
                      Reports
                      <IoArrowForwardOutline className="mr-2" />
                    </span>
                  </Link>
                </div>
              </InfoWindow>
            ) : null}
          </Marker>
        ))}
      </GoogleMap>
    </main>
  );
}

export default Home;
