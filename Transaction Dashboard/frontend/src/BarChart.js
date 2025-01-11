import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Number of Items',
        data: Object.values(data),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  return (
    <div>
      <Bar data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  );
};

export default BarChart;
