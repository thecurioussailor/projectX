import TotalSaleCard from "../components/dashboard/TotalSaleCard"

const Dashboard = () => {
  return (
    <section className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#7F37D8]">Dashboard</h1>
        </div>
        <div className="flex justify-between gap-4">
          <TotalSaleCard amount="1000" gradient="bg-gradient-to-r from-purple-500 to-blue-500" />
          <TotalSaleCard amount="1000" gradient="bg-gradient-to-r from-pink-500 to-pink-600" />
          <TotalSaleCard amount="1000" gradient="bg-gradient-to-r from-yellow-300 to-yellow-500" />
          <TotalSaleCard amount="1000" gradient="bg-gradient-to-r from-sky-500 to-sky-600" />
        </div>
    </section>
  )
}

export default Dashboard