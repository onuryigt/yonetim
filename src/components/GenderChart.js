import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Male', 'Female'],
  datasets: [
    {
      label: 'Candidates by Gender',
      data: [300, 200],
      backgroundColor: ['#4A90E2', '#50E3C2'],
      hoverOffset: 4,
    },
  ],
};

const GenderChart = () => {
  return <Doughnut data={data} />;
};

export default GenderChart;