import MoneyCard from "./MoneyCard"
import { useWallet } from "../../hooks/useWallet";
import { useState } from "react";
import CreateWithdrawalRequest from "./CreateWithdrawalRequest";
import WidrawalRequestsTable from "./WidrawalRequestsTable";
const Wallet = () => {

  const { wallet } = useWallet();
  const [showWithdrawalRequest, setShowWithdrawalRequest] = useState(false);

  return (
    <div className="flex flex-col gap-8 w-full">
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
                <div className="flex flex-col md:flex-row justify-between items-center pb-8 px-12 gap-1">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-[#1B3155]">Wallet</span>
                            <span className="text-gray-500 text-sm">KYC pending</span>
                        </div>
                        <p className="text-gray-500 text-sm">Manage your wallet balance and withdraw funds</p>
                    </div>
                    <div className="pt-4 md:pt-0">
                        <button 
                            onClick={() => setShowWithdrawalRequest(true)}
                            className="bg-[#7E37D8] text-white px-6 py-2 rounded-3xl">
                                Withdraw
                        </button>
                        {showWithdrawalRequest && <CreateWithdrawalRequest onClose={() => setShowWithdrawalRequest(false)} />}
                    </div>
                </div>         
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-8 px-8 border-t justify-items-center border-gray-200">
                    <MoneyCard amount={wallet?.totalEarnings || 0} gradient="bg-gradient-to-r from-green-400 to-emerald-500" title="Total Earnings" />
                    <MoneyCard amount={wallet?.totalBalance || 0} gradient="bg-gradient-to-r from-indigo-500 to-indigo-700" title="Total Balance" />
                    <MoneyCard amount={wallet?.withdrawableBalance || 0} gradient="bg-gradient-to-r from-rose-400 to-red-500" title="Withdrawable Balance" />
                    <MoneyCard amount={wallet?.totalWithdrawn || 0} gradient="bg-gradient-to-r from-rose-400 to-red-500" title="Total Withdrawals" />
                </div>   
            </div>
        </div>
        <WidrawalRequestsTable />
    </div>
  )
}

export default Wallet