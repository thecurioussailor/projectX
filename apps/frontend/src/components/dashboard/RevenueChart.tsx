import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useDashboard } from '../../hooks/useDashboard';
import { useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: 'Revenue Statistics',
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};



const RevenueChart = () => {
  
  const { fetchDailySalesStats, dailySalesStats, isLoadingSales } = useDashboard();

  useEffect(() => {
    fetchDailySalesStats();
  }, [fetchDailySalesStats]);

  
  const labels = dailySalesStats?.map((item) => new Date(item.date).toLocaleDateString('en-us', {day: 'numeric', month: 'short'}));

  const data = {
    labels,
    datasets: [
      {
        label: 'Telegram Subscription (INR)',
        data: dailySalesStats?.map((item) => item.telegramRevenue),
        borderColor: '#FF2F82',
        backgroundColor: '#FF2F82',
      },
      {
        label: 'Digital Products (INR)',
        data: dailySalesStats?.map((item) => item.digitalRevenue),
        borderColor: '#00A8CD',
        backgroundColor: '#00A8CD',
      },

    ],
  };

  return (
    <div className="w-full bg-white rounded-[3rem] p-8 overflow-clip shadow-lg shadow-purple-100 h-min-fit">
        <div className="relative">
            <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
            <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
            <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
            <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
            <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
            <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
        </div>
        <div className="p-4 px-6">
            <h1 className="font-bold text-xl">Revenue Statistics</h1>
            <div className="w-full h-64 lg:h-96">
              {isLoadingSales ? <LoadingSpinner /> : <Bar options={options} data={data} />}
            </div>
        </div>
    </div>
  )
}

export default RevenueChart