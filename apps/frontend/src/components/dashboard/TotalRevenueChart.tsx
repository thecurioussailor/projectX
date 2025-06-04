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
import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useDashboard } from '../../hooks/useDashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const TotalRevenueChart = () => {

    const { fetchDailySalesStats, dailySalesStats, isLoadingSales } = useDashboard();

    useEffect(() => {
        fetchDailySalesStats();
    }, [fetchDailySalesStats]);

    if (isLoadingSales) {
        return <div>Loading...</div>;
    }


    const labels = dailySalesStats?.map((item) => new Date(item.date).toLocaleDateString('en-us', {day: 'numeric', month: 'short'}));
  
    const data = {
        labels,
        datasets: [
          {
            label: 'Total Revenue',
            data: dailySalesStats?.map((item) => item.totalRevenue),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
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
            <h1 className="font-bold text-xl">Total Revenue</h1>
            <div className="w-full h-full">
                <Line options={options} data={data} />
            </div>
        </div>
    </div>
  )
}

export default TotalRevenueChart