  import { useWithdrawal } from "../../hooks/useWithdrawal";
import { Withdrawal } from "../../store/useWithdrawalStore";

const PayoutRequestsTable = () => {
  const { withdrawals } = useWithdrawal();
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
        <h1 className="text-2xl pb-10 px-12 font-bold text-[#1B3155]">Payout Requests</h1>
        {/* tabular view */}
        <table className="w-full text-left">
            <thead className=" border-gray-300 h-20">
                <tr className="border-t border-gray-200 text-[#1B3155]">
                    <th className="w-1/12 px-8">#</th>
                    <th className="w-1/12">Name</th>
                    <th className="w-1/12">Email</th>
                    <th className="w-1/12">Username</th>
                    <th className="w-1/12">Amount</th>
                    <th className="w-1/12">Status</th>
                    <th className="w-1/12">Payment Method</th>
                    <th className="w-1/12">Admin Notes</th>
                    <th className="w-1/12">Created At</th>
                </tr>
            </thead>
            <tbody>
                {withdrawals?.map((withdrawal, index) => (
                    <PayoutRequestsTableRow key={index} withdrawal={withdrawal} index={index} />
                ))}  
            </tbody>
        </table>
    </div>
</div>
  )
}

export default PayoutRequestsTable

const PayoutRequestsTableRow = ({withdrawal, index}: {withdrawal: Withdrawal, index: number}) => {

    return (
        <tr className="border-t border-gray-200 h-20 text-[#1B3155]">
            <td className="px-8">{index + 1}</td>
            <td className="font-semibold">{withdrawal.wallet.user.username}</td>
            <td>{withdrawal.wallet.user.email}</td>
            <td>{withdrawal.wallet.user.username}</td>
            <td>{withdrawal.amount}</td>
            <td>{withdrawal.status}</td>
            <td>{withdrawal.paymentMethod}</td>
            <td>{withdrawal.adminNotes}</td>
            <td>{new Date(withdrawal.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>
    )
}