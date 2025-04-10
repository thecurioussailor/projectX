import PiChartCard from "../components/dashboard/PiChartCard"
import RecentPurchases from "../components/dashboard/RecentPurchases"
import TotalSaleCard from "../components/dashboard/TotalSaleCard"

const Dashboard = () => {
  return (
    <section className="flex flex-col gap-8">
        <div className="flex justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#7F37D8]">Dashboard</h1>
        </div>
        <div className="grid grid-cols-4 justify-between gap-4">
          <TotalSaleCard amount="19000" gradient="bg-gradient-to-r from-purple-500 to-blue-500" title={"Total Revenue"}/>
          <TotalSaleCard amount="100" gradient="bg-gradient-to-r from-pink-500 to-pink-600" title={"Total Sale"}/>
          <TotalSaleCard amount="50" gradient="bg-gradient-to-r from-yellow-300 to-yellow-500" title={"Total Order"}/>
          <TotalSaleCard amount="100000" gradient="bg-gradient-to-r from-sky-500 to-sky-600" title={"Total Views"}/>
          <TotalSaleCard amount="19000" gradient="bg-gradient-to-r from-purple-500 to-blue-500" title={"Total Revenue"}/>
          <TotalSaleCard amount="100" gradient="bg-gradient-to-r from-pink-500 to-pink-600" title={"Total Sale"}/>
          <TotalSaleCard amount="50" gradient="bg-gradient-to-r from-yellow-300 to-yellow-500" title={"Total Order"}/>
          <TotalSaleCard amount="100000" gradient="bg-gradient-to-r from-sky-500 to-sky-600" title={"Total Views"}/>
        </div>
        <div>
          <PiChartCard />
        </div>
        <div>
          <RecentPurchases />
        </div>
    </section>
  )
}

export default Dashboard