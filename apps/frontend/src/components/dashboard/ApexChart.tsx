import { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../hooks/useDashboard";
import LoadingSpinner from "../ui/LoadingSpinner";

const TotalRevenueApexChart = () => {
  const { fetchDailySalesStats, dailySalesStats, isLoadingSales } = useDashboard();

  useEffect(() => {
    fetchDailySalesStats();
  }, [fetchDailySalesStats]);

  // Prepare data for ApexCharts
  const categories = dailySalesStats?.map(item =>
    new Date(item.date).toLocaleDateString("en-us", { day: "numeric", month: "short" })
  ) || [];

  // Calculate cumulative revenue
  const dailyRevenue = dailySalesStats?.map(item => item.totalRevenue) || [];
  const cumulativeRevenue = dailyRevenue.reduce((acc, curr, idx) => {
    acc.push((acc[idx - 1] || 0) + curr);
    return acc;
  }, [] as number[]);

  const series = [
    {
      name: "Total Revenue",
      data: cumulativeRevenue,
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "straight" },
    title: {
      text: "Total Revenue",
      align: "center",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories,
    },
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
          {isLoadingSales ? (
            <LoadingSpinner />
          ) : (
            <ReactApexChart options={options} series={series} type="line" height={350} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalRevenueApexChart;