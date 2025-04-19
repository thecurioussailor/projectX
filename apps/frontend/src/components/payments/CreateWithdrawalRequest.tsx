import { IoCloseOutline } from "react-icons/io5"
import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
const CreateWithdrawalRequest = ({ onClose }: { onClose: () => void }) => {
    const [amount, setAmount] = useState(0);
    const { createWithdrawalRequest } = useWallet();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createWithdrawalRequest(amount);
        onClose();
    }
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black/50">
        <div className="flex flex-col gap-2 bg-white p-8 items-center rounded-3xl border border-gray-200">
            
        <div className="pb-6 border-b border-gray-200 flex justify-between w-full items-center">
            <h2 className="text-xl font-semibold">Create Withdrawal Request</h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                <IoCloseOutline size={30}/>
            </button>
        </div>
        <div className="w-full flex flex-col gap-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label htmlFor="amount">Amount</label>
                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                <button 
                type="submit"
                className="bg-purple-500 text-white px-6 py-2 rounded-3xl">
                    Create
            </button>
            </form>
        </div>
        </div>
    </div>  
  )
}

export default CreateWithdrawalRequest