import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CarbonChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Carbon Footprint (tons CO2e)',
        data: [1.2, 1.5, 1.3, 1.8, 1.6, 2.1, 2.3],
        fill: false,
        backgroundColor: '#2ecc71',
        borderColor: '#27ae60',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Carbon Footprint Over Time',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default CarbonChart;
