'use client';
import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import { useGenerateImage } from 'recharts-to-png';
import { Download, FileDown } from 'lucide-react';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Cookies from 'js-cookie';
import axiosClient from '@/helpers/axios';

const MAX_DATA_POINTS = 50;

const parameters = [
  { value: 'temperature', label: 'Temperature', color: '#ff6b6b' },
  { value: 'pressure', label: 'Pressure', color: '#4ecdc4' },
  { value: 'altitude', label: 'Altitude', color: '#45b7d1' },
  { value: 'gas', label: 'Gas', color: '#96ceb4' },
];

const UserInputChart = ({ email }: any) => {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState('all');
  const [selectedParameters, setSelectedParameters] = useState(['temperature']);
  const [isLoading, setIsLoading] = useState(false);
  const [getDivJpeg, { ref: divRef }] = useGenerateImage({
    quality: 0.8,
    type: 'image/jpeg',
  });

  const handleDownload = async () => {
    const png = await getDivJpeg();
    if (png) {
      const activeParams = selectedParameters.join('-');
      const timestamp = new Date().toLocaleString();
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const addPageBackground = () => {
        doc.setFillColor(30, 30, 30);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
      };
      addPageBackground();
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(timestamp, pageWidth - 10, 10, { align: 'right' });
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text('Sensor Data Report', 10, 20);
      const graphHeight = 110;
      doc.addImage(png, 'JPEG', 10, 30, 280, graphHeight);
      const stats = selectedParameters.map((param) => {
        const values = data
          .map((item) => item[param])
          .filter((v) => v !== undefined);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = (
          values.reduce((sum, value) => sum + value, 0) / values.length
        ).toFixed(2);
        return { 
          param: param.charAt(0).toUpperCase() + param.slice(1),
          min: min.toFixed(2),
          max: max.toFixed(2),
          avg
        };
      });
      const startY = graphHeight + 40; 
      const cellPadding = 5;
      const colWidth = 65;
      const rowHeight = 12;
      const tableWidth = colWidth * 4;
      doc.setFillColor(50, 50, 50);
      doc.rect(10, startY, tableWidth, rowHeight, 'F');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text('Parameter', 10 + cellPadding, startY + 8);
      doc.text('Minimum', 10 + colWidth + cellPadding, startY + 8);
      doc.text('Maximum', 10 + (colWidth * 2) + cellPadding, startY + 8);
      doc.text('Average', 10 + (colWidth * 3) + cellPadding, startY + 8);
      const rowsPerPage = Math.floor((pageHeight - startY - 20) / rowHeight);
      const needsSecondPage = stats.length > rowsPerPage;
      stats.forEach((stat, index) => {
        let currentY = startY + (rowHeight * (index + 1));

        if (needsSecondPage && index === rowsPerPage) {
          doc.addPage();
          addPageBackground();
          doc.setFontSize(10);
          doc.setTextColor(150, 150, 150);
          doc.text(timestamp, pageWidth - 10, 10, { align: 'right' });
          doc.setFillColor(50, 50, 50);
          doc.rect(10, 20, tableWidth, rowHeight, 'F');
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.text('Parameter', 10 + cellPadding, 28);
          doc.text('Minimum', 10 + colWidth + cellPadding, 28);
          doc.text('Maximum', 10 + (colWidth * 2) + cellPadding, 28);
          doc.text('Average', 10 + (colWidth * 3) + cellPadding, 28);
          
          currentY = 20 + rowHeight;
        }
        if (index >= rowsPerPage) {
          currentY = 20 + (rowHeight * (index - rowsPerPage + 1));
        }
        if (index % 2 === 0) {
          doc.setFillColor(40, 40, 40);
          doc.rect(10, currentY, tableWidth, rowHeight, 'F');
        }
        doc.setTextColor(255, 255, 255);
        doc.text(stat.param, 10 + cellPadding, currentY + 8);
        doc.text(stat.min.toString(), 10 + colWidth + cellPadding, currentY + 8);
        doc.text(stat.max.toString(), 10 + (colWidth * 2) + cellPadding, currentY + 8);
        doc.text(stat.avg.toString(), 10 + (colWidth * 3) + cellPadding, currentY + 8);
      });
      doc.setDrawColor(100, 100, 100);
      if (needsSecondPage) {
        const firstPageRows = rowsPerPage;
        doc.rect(10, startY, tableWidth, rowHeight * (firstPageRows + 1));
        doc.setPage(1);
        const remainingRows = stats.length - rowsPerPage;
        doc.rect(10, 20, tableWidth, rowHeight * (remainingRows + 1));
      } else {
        doc.rect(10, startY, tableWidth, rowHeight * (stats.length + 1));
      }
      doc.save(`sensor-report-${activeParams}-${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = ['Date', 'Time', ...selectedParameters];
    let csvContent = headers.join(',') + '\n';


    data.forEach((row: any) => {
      const date = new Date(row.createdAt);
      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString();
      const values = selectedParameters.map((param) => row[param]);
      csvContent += [dateStr, timeStr, ...values].join(',') + '\n';
    });


    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sensor-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const normalizeValue = (value: any, param: any, data: any) => {
    const values = data
      .map((item: any) => item[param])
      .filter((v: any) => v !== undefined);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return max === min ? 50 : ((value - min) / (max - min)) * 100;
  };

  const clusterData = (rawData: any) => {
    let processedData = rawData.length > MAX_DATA_POINTS ? [] : rawData;
    if (rawData.length > MAX_DATA_POINTS) {
      const clusterSize = Math.ceil(rawData.length / MAX_DATA_POINTS);
      for (let i = 0; i < rawData.length; i += clusterSize) {
        const cluster = rawData.slice(i, i + clusterSize);
        const dataPoint: { createdAt: any; [key: string]: any } = {
          createdAt: cluster[Math.floor(cluster.length / 2)].createdAt,
        };
        selectedParameters.forEach((param) => {
          const avgValue =
            cluster.reduce((sum: any, point: any) => sum + point[param], 0) /
            cluster.length;
          dataPoint[param] = Number(avgValue.toFixed(2));
        });
        processedData.push(dataPoint);
      }
    }
    return processedData.map((point: any) => {
      const enhancedPoint = { ...point };
      selectedParameters.forEach((param: any) => {
        enhancedPoint[`${param}Normalized`] = normalizeValue(
          point[param],
          param,
          rawData
        );
      });
      return enhancedPoint;
    });
  };

  const getCachedData = (key: any) => {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 10 * 60 * 1000) return data;
    }
    return null;
  };

  const setCachedData = (key: any, data: any) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const cacheKey = `graph_data_${timeframe}_${email}`;
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          setData(clusterData(cachedData));
          setIsLoading(false);
          return;
        }
        const decodedEmail = decodeURIComponent(email);
        const response = await axiosClient.get(`/data/graph/${timeframe}`, {
          params: { email: decodedEmail },
          headers: { Authorization: `Bearer ${Cookies.get('admin')}` },
        });
        setCachedData(cacheKey, response.data);
        setData(clusterData(response.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeframe, selectedParameters.join(','), email]);

  return (
    <div
      ref={divRef}
      className="flex items-center justify-center min-h-screen bg-black"
    >
      <div className="p-6 bg-gray-800 rounded-xl w-full ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-100">
            Sensor Data Analysis
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
              title="Export CSV"
            >
              <FileDown className="w-5 h-5 text-gray-300" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
              title="Download Graph"
            >
              <Download className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-3 flex-wrap">
            {['1week', '2weeks', '1month', '6months', 'all'].map((option) => (
              <button
                key={option}
                onClick={() => setTimeframe(option)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                  timeframe === option
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {parameters.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => {
                  setSelectedParameters((prev) =>
                    prev.includes(value)
                      ? prev.filter((p) => p !== value)
                      : [...prev, value]
                  );
                }}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                  selectedParameters.includes(value)
                    ? 'border-2 text-white'
                    : 'border border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
                style={{
                  borderColor: selectedParameters.includes(value)
                    ? color
                    : undefined,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 bg-black rounded-lg p-4">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="createdAt"
                  tickFormatter={(timestamp) =>
                    new Date(timestamp).toLocaleDateString()
                  }
                  stroke="#666"
                />
                <YAxis
                  yAxisId="normalized"
                  domain={[0, 100]}
                  label={{
                    value: 'Normalized Values (%)',
                    angle: -90,
                    position: 'outsideLeft',
                    offset: -10,
                    style: { fill: '#666' },
                  }}
                  stroke="#666"
                />
                <YAxis
                  yAxisId="original"
                  orientation="right"
                  domain={['auto', 'auto']}
                  stroke="#666"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                  formatter={(value, name, props) => {
                    const originalName = String(name).replace('Normalized', '');
                    const originalValue = props.payload[originalName];
                    return [
                      originalValue,
                      parameters.find((p) => p.value === originalName)?.label,
                    ];
                  }}
                />
                <Legend />
                {selectedParameters.map((param) => (
                  <Line
                    key={param}
                    type="monotone"
                    dataKey={`${param}Normalized`}
                    stroke={parameters.find((p) => p.value === param)?.color}
                    dot={false}
                    strokeWidth={2}
                    yAxisId="normalized"
                    name={param}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInputChart;
