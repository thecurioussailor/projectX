const PiChartCard = () => {
  return (
    <div className="w-full bg-white rounded-[3rem] p-8 h-40 overflow-clip shadow-lg shadow-purple-100">
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
            <div>

            </div>
        </div>
    </div>
  )
}

export default PiChartCard