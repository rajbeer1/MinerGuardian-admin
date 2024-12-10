import React from 'react';
import {
  IoThermometerOutline,
  IoWaterOutline,
  IoLocationOutline,
  IoMailOutline,
  IoTimeOutline,
  IoArrowForwardOutline,
} from 'react-icons/io5';
import Link from 'next/link';

const MinersView = ({ miners }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {miners.map((miner: any, index: number) => (
        <div
          key={index}
          className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-lg shadow-md p-6 flex flex-col justify-between text-white"
        >
          <div>
            <h3 className="text-lg font-semibold mb-2 flex justify-center">
              {miner.name}
            </h3>
            <ul className="text-stone-900">
              <li className="flex items-center mb-2">
                <IoMailOutline className="mr-2" />
                <span className="font-semibold">Email:</span> {miner.email}
              </li>
              <li className="flex items-center mb-2">
                <IoThermometerOutline className="mr-2" />
                <span className="font-semibold">Temperature:</span>{' '}
                {miner.temperature.toFixed(2)} °C
              </li>
              <li className="flex items-center mb-2">
                <IoWaterOutline className="mr-2" />
                <span className="font-semibold">Pressure:</span>{' '}
                {miner.pressure.toFixed(2)} hPa
              </li>
              <li className="flex items-center mb-2">
                <IoLocationOutline className="mr-2" />
                <span className="font-semibold">Distance:</span>{' '}
                {miner.distance.toFixed(2)} m
              </li>
              <li className="flex items-center mb-2">
                <IoLocationOutline className="mr-2" />
                <span className="font-semibold">Gas:</span>{' '}
                {miner.gas.toFixed(2)}
              </li>
            </ul>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <IoTimeOutline className="mr-2" />
              <span className="text-sm text-gray-300">
                Time: {new Date(miner.updatedAt).toLocaleString()}
              </span>
            </div>
            <Link href={`/graph/${miner.email}`}>
              <span className="text-sm text-gray-300 flex items-center gap-2">
                Reports
                <IoArrowForwardOutline className="mr-2" />
              </span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MinersView;
