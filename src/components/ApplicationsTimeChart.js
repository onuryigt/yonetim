import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Applications Received Time',
    },
  },
};

const data = {
  labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'],
  datasets: [
    {
      label: 'Applications',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: '#FF3366',
      backgroundColor: '#FF3366',
    },
  ],
};

const ApplicationsTimeChart = () => {
  return <Line options={options} data={data} />;
};

export default ApplicationsTimeChart;