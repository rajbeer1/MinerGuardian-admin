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
import LoadingRings from '@/components/loader';
import { jwtDecode } from '@/helpers/jwt';

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
      const token = Cookies.get('user');
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
    return <div>Loading</div>;
  }

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
        <LoadingRings />
      </>
    );
  return (
    <main
      style={{
        position: 'relative',
        width: '100%',
        height: `calc(100vh - 60px)`,
      }}
    >
      {' '}
      <GoogleMap
        mapContainerStyle={{
          position: 'relative',
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
