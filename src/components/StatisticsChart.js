import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Statistics of Active Applications',
    },
  },
};

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Applications',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: '#4A90E2',
    },
    {
      label: 'Shortlisted',
      data: [28, 48, 40, 19, 86, 27, 90],
      backgroundColor: '#50E3C2',
    },
    {
      label: 'Rejected',
      data: [18, 48, 77, 9, 100, 27, 40],
      backgroundColor: '#FF3366',
    },
  ],
};

const StatisticsChart = () => {
  return <Bar options={options} data={data} />;
};

export default StatisticsChart;