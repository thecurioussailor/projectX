import MoneyCard from "./MoneyCard"

const Wallet = () => {
  return (
    <div className="flex justify-between gap-4 bg-white rounded-[3rem] w-full overflow-clip shadow-lg shadow-purple-100">
            <div className="flex flex-col gap-4 w-full">
                <div className="relative ml-8 mt-8">
                    <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
                    <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
                    <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
                    <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
                    <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
                    <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
                </div>
                <div className="flex flex-col pb-8 px-12 gap-1">
                    <h1 className="text-2xl font-bold text-[#1B3155]">Wallet</h1>
                    <p className="text-gray-500 text-sm">Manage your wallet balance and make payments</p>
                </div>         
                <div className="flex flex-wrap gap-12 py-8 px-8 border-t border-gray-200">
                    <MoneyCard amount="100" gradient="bg-gradient-to-r from-green-400 to-emerald-500" title="Total Earnings" />
                    <MoneyCard amount="100" gradient="bg-gradient-to-r from-indigo-500 to-indigo-700" title="Withdrawable" />
                    <MoneyCard amount="100" gradient="bg-gradient-to-r from-rose-400 to-red-500" title="Current Balance" />
                </div>
                
            </div>
        </div>
  )
}

export default Wallet