import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { WithdrawalRequest } from "../../store/useWalletStore";
import Error from "../ui/Error";
import LoadingSpinner from "../ui/LoadingSpinner";
import WithdrawalRequestSidePop from "./WithdrawalRequestSidePop";
const WidrawalRequestsTable = () => {
    const { withdrawalRequests, isLoading, error } = useWallet();
    if (isLoading) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }


    if (error) {
        return (
            <Error error={"error"} />
        );
    }

    if (!withdrawalRequests || withdrawalRequests.length === 0) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <p className="text-gray-600">No withdrawable request found</p>
            </div>
        );
    }
  return (
    <div className="flex justify-between gap-4 bg-white rounded-[3rem] w-full overflow-clip shadow-lg shadow-purple-100 mb-16 md:mb-0">
        <div className="flex flex-col gap-4 w-full">
            <div className="relative ml-8 mt-8">
                <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
                <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
                <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
                <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
                <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
                <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
            </div>
            <div className="flex justify-between items-center pb-8 px-12 gap-1">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-[#1B3155]">Withdrawal Requests</span>
                    </div>
                    <p className="text-gray-500 text-sm">Manage your withdrawal requests</p>
                </div>
            </div>
            <div className="overflow-x-scroll lg:overflow-x-hidden">         
                <table className="w-full text-left min-w-max lg:min-w-full">
                    <thead className=" border-gray-300 h-20">
                        <tr className="border-t border-gray-200">
                            <th className="lg:w-1/12 px-8">#</th>
                            <th className="lg:w-1/12 px-4">Amount (INR)</th>
                            <th className="lg:w-1/12 px-4">Status</th>
                            <th className="lg:w-1/12 px-4">Created</th>
                            <th className="lg:w-1/12 px-4">Processed</th>
                            <th className="lg:w-1/12 px-4">Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {withdrawalRequests?.map(( withdrawalRequest, index) => (
                            <WithdrawalRequestRow key={withdrawalRequest.id} withdrawalRequest={withdrawalRequest} index={index} />
                        ))}
                    </tbody>
                </table> 
            </div>  
        </div>
    </div>
  )
}

export default WidrawalRequestsTable

const WithdrawalRequestRow = ({ withdrawalRequest, index }: { withdrawalRequest: WithdrawalRequest, index: number }) => {
    const [isSidePopOpen, setIsSidePopOpen] = useState(false);
    return (
        <tr className="border-t border-gray-200 h-20">
            <td className="px-8">{index + 1}</td>
            <td className="px-4">{withdrawalRequest.amount}</td>
            <td className="px-4"><div className={`border w-fit px-2 flex items-center gap-2 py-1 rounded-full`}><div className={`${withdrawalRequest.status === "ACTIVE" ? "bg-green-500": "bg-red-500"} w-2 h-2 rounded-full`}></div><span className="text-xs">{withdrawalRequest.status === "ACTIVE" ? "Paid" : "Pending"}</span></div></td>
            <td className="px-4">{new Date(withdrawalRequest.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })}</td>
            <td className="px-4">{withdrawalRequest.processedAt ? new Date(withdrawalRequest.processedAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }) : "N/A"}</td>
            <td className="px-4">
                <button 
                onClick={() => setIsSidePopOpen(true)}
                className="text-white bg-[#7e37d8] px-4 py-2 rounded-full">
                    View
                </button>
                {isSidePopOpen && <WithdrawalRequestSidePop withdrawalRequest={withdrawalRequest} onClose={() => setIsSidePopOpen(false)} />}
            </td>
        </tr>
    )
}
