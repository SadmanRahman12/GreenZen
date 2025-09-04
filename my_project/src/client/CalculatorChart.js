import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CalculatorChart = ({ data }) => {
  const chartData = {
    labels: ['Transport', 'Energy', 'Diet', 'Waste'],
    datasets: [{
      data: [data.transport, data.energy, data.diet, data.waste],
      backgroundColor: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B'],
      borderColor: '#fff',
      borderWidth: 2,
      hoverOffset: 4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return <Doughnut data={chartData} options={chartOptions} />;
};

export default CalculatorChart;
