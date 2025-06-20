import RevenueChart from "../components/dashboard/RevenueChart"
import RecentPurchases from "../components/dashboard/RecentPurchases"
import TotalSaleCard from "../components/dashboard/TotalSaleCard"
import PiChartSales from "../components/dashboard/PiChartSales"
import { useDashboard } from "../hooks/useDashboard"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import TotalRevenueApexChart from "../components/dashboard/ApexChart"
const Dashboard = () => {
  const { stats, isLoading, error } = useDashboard();
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "0 INR";
    return `${amount.toLocaleString()} INR`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error loading dashboard: {error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">No dashboard data available</div>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-8 pb-16">
        <div className="flex justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#7F37D8]">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center gap-4">
          <TotalSaleCard 
            amount={formatCurrency(Number(stats?.digitalProductStats?._sum?.amount) + Number(stats?.telegramStats?._sum?.amount))} 
            gradient="bg-gradient-to-r from-fuchsia-500 to-purple-600" 
            title={"Total Earnings"}
          />
          <TotalSaleCard 
            amount={formatCurrency(stats?.digitalProductStats?._sum?.amount || 0)} 
            gradient="bg-gradient-to-r from-pink-500 to-pink-600" 
            title={"Digital Sales"}
          />
          <TotalSaleCard 
            amount={formatCurrency(stats?.telegramStats?._sum?.amount || 0)} 
            gradient="bg-gradient-to-r from-yellow-300 to-yellow-500" 
            title={"Telegram Earnings"}
          />
          <TotalSaleCard 
            amount={stats?.totalProductsCreated.toString()} 
            gradient="bg-gradient-to-r from-sky-500 to-sky-600" 
            title={"Digital Products"}
          />
          <TotalSaleCard 
            amount={stats?.totalChannelsCreated.toString()} 
            gradient="bg-gradient-to-r from-green-400 to-emerald-500" 
            title={"Channels"}
          />
          <TotalSaleCard 
            amount={(stats?.digitalProductStats?._count + stats?.telegramStats?._count).toString()} 
            gradient="bg-gradient-to-r from-indigo-500 to-indigo-700" 
            title={"Total Sales"}
          />
          <TotalSaleCard 
            amount={stats?.totalShortLinksCreated.toString()} 
            gradient="bg-gradient-to-r from-rose-400 to-red-500" 
            title={"Short Links"}
          />
          <TotalSaleCard 
            amount={stats?.totalClickCount?._sum?.clicks?.toString() || "0"} 
            gradient="bg-gradient-to-r from-orange-400 to-amber-500" 
            title={"Click Count"}
          />
        </div>
        <div className="w-full h-96 mb-36">
          <TotalRevenueApexChart />
        </div>
        <div className="w-full">
          <RevenueChart />
        </div>
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {stats.recentSales.length !== 0 && <div className="w-full lg:w-2/3">
            <RecentPurchases data={stats?.recentSales}/>
          </div>}

          {((stats.digitalProductStats._count ?? 0) > 0 || (stats.telegramStats._count ?? 0) > 0) && <div className="w-full lg:w-1/3">
            <PiChartSales 
              total={Number(stats?.digitalProductStats?._count) + Number(stats?.telegramStats?._count)}
              digital={Number(stats?.digitalProductStats?._count)}
              telegram={Number(stats?.telegramStats?._count)}
            />
          </div>}
        </div>
    </section>
  )
}

export default Dashboard