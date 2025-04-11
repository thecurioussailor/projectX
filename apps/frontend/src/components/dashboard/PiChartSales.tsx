import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


 


const PiChartSales = ({total, digital, telegram}: { total: number, digital: number, telegram: number}) => {
    const data = {
        labels: ['Telegram Subscriptions', 'Digital Product'],
        datasets: [
          {
            label: 'Sale',
            data: [telegram, digital],
            backgroundColor: [
              '#FE5296',
              '#07B7DD',
            ],
            borderColor: [
              '#FE5296',
              '#07B7DD',
            ],
            borderWidth: 1,
          },
        ],
      };
  return (
    <div className="w-full bg-white rounded-[3rem] p-8 overflow-clip shadow-lg shadow-purple-100">
          <div className="relative">
              <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
              <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
              <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
              <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
              <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
              <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
          </div>
          <div className="p-4 px-6 flex flex-col gap-4">
              <h1 className="font-bold text-xl">Sales</h1>
              <div>
                <Pie 
                    data={data}
                />
              </div>
              <h1>Total: {total}</h1>
          </div>
      </div>
  )
}

export default PiChartSales