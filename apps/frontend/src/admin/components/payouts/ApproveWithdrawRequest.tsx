import { FaSpinner } from "react-icons/fa";
import { useWithdrawal } from "../../hooks/useWithdrawal";
import { useState } from "react";
const ApproveWithdrawRequest = ({ withdrawalId }: { withdrawalId: string }) => {
  const { approveWithdrawal } = useWithdrawal();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [data, setData] = useState({
    status: "PAID",
    transactionId: "",
    paymentMethod: "",
    bankName: "",
    accountNumber: "",
    adminNotes: "",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdateLoading(true);
    await approveWithdrawal(withdrawalId, data);
    setIsUpdateLoading(false);
  }
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Update Withdraw Request</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <label className="text-xs text-[#718096]">Status:</label>
                    <select className="w-full p-1 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent" onChange={(e) => setData({ ...data, status: e.target.value })}>
                        <option value="PAID">PAID</option>
                        <option value="REJECTED">REJECTED</option>
                    </select>
                </div>
                {data.status === "PAID" && (
                    <>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[#718096]">Transaction ID:</p>
                            <input type="text" className="w-full p-1 outline-none border border-gray-300 rounded-md focus:ring-1 focus:ring-[#7F37D8] focus:border-transparent" onChange={(e) => setData({ ...data, transactionId: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[#718096]">Payment Method:</p>
                            <input type="text" className="w-full p-1 outline-none border border-gray-300 rounded-md focus:ring-1 focus:ring-[#7F37D8] focus:border-transparent" onChange={(e) => setData({ ...data, paymentMethod: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[#718096]">Bank Name:</p>
                            <input type="text" className="w-full p-1 outline-none border border-gray-300 rounded-md focus:ring-1 focus:ring-[#7F37D8] focus:border-transparent" onChange={(e) => setData({ ...data, bankName: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[#718096]">Account Number:</p>
                            <input type="text" className="w-full p-1 outline-none border border-gray-300 rounded-md focus:ring-1 focus:ring-[#7F37D8] focus:border-transparent" onChange={(e) => setData({ ...data, accountNumber: e.target.value })} />
                        </div>
                    </>
                )}
                {data.status === "REJECTED" && (
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-[#718096]">Admin Notes:</p>
                        <input type="text" className="w-full p-1 outline-none border border-gray-300 rounded-md focus:ring-1 focus:ring-[#7F37D8] focus:border-transparent" onChange={(e) => setData({ ...data, adminNotes: e.target.value })} />
                    </div>
                )}
                <button type="submit" className="bg-[#7F37D8] text-white px-4 py-2 rounded-md" disabled={isUpdateLoading}>{isUpdateLoading ? <div className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Updating...</div> : "Update"}</button>
            </form>
        </div>
  )
}

export default ApproveWithdrawRequest