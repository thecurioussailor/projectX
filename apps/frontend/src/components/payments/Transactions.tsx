import { Transaction } from "../../store/useTransactionStore";
import { useTransaction } from "../../hooks/useTransaction";
import LoadingSpinner from "../ui/LoadingSpinner";
import Error from "../ui/Error";
import { useState } from "react";
import TransactionSidePop from "./TransactionSidePop";


const Transactions = () => {
    const { transactions, isLoading, error } = useTransaction();
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

    if (!transactions || transactions.length === 0) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <p className="text-gray-600">No transaction found</p>
            </div>
        );
    }
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
                <h1 className="text-2xl pb-10 px-12 font-bold text-[#1B3155]">Transactions</h1>
                {/* tabular view */}
                <table className="w-full text-left">
                    <thead className=" border-gray-300 h-20">
                        <tr className="border-t border-gray-200">
                            <th className="w-1/12 px-8">#</th>
                            <th className="w-2/12">Name</th>
                            <th className="w-1/12">Type</th>
                            <th className="w-1/12">Status</th>
                            <th className="w-1/12">Amount(INR)</th>
                            <th className="w-1/12">Date</th>
                            <th className="w-1/12">Customer Username</th>
                            <th className="w-1/12">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions?.map((transaction, index) => (
                            <TransactionRow key={index} transaction={transaction} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default Transactions

const TransactionRow = ({transaction, index}: {transaction: Transaction, index: number}) => {
    const [isSidePopOpen, setIsSidePopOpen] = useState(false);
    return (
        <tr className="border-t border-gray-200 h-20">
            <td className="px-8">{index + 1}</td>
            <td>{transaction.order?.digitalProduct?.title || transaction.order?.telegramPlan?.name}</td>
            <td><span className="bg-[#E7F3FE] text-[#158DF7] text-xs font-semibold rounded-full px-2 py-1">{transaction.order?.productType}</span></td>
            <td><div className={`border w-fit px-2 flex items-center gap-2 py-1 rounded-full`}><div className={`${transaction.status === "SUCCESS" ? "bg-green-500": "bg-red-500"} w-2 h-2 rounded-full`}></div><span className="text-xs">{transaction.status === "SUCCESS" ? "Success" : "Failed"}</span></div></td>
            <td>{transaction.amount}</td>
            <td className="text-xs font-semibold text-gray-700">{new Date(transaction.paymentTime).toLocaleDateString("en-US", { month: "long", day: "numeric"})}</td>
            <td className="text-[#158DF7] font-semibold">{transaction.order?.user?.username}</td>
            <td>
                <button 
                onClick={() => setIsSidePopOpen(true)}
                className="text-white bg-[#7e37d8] px-4 py-2 rounded-full">
                    View
                </button>
                {isSidePopOpen && <TransactionSidePop transaction={transaction} onClose={() => setIsSidePopOpen(false)} />}
            </td>
        </tr>
    )
}