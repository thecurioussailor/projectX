import { IoCloseOutline } from "react-icons/io5"
import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { usePaymentMethod } from "../../hooks/usePaymentMethod";
import { useToast } from "../ui/Toast";
import { AxiosError } from "axios";
import { FaSpinner } from "react-icons/fa";

const CreateWithdrawalRequest = ({ onClose }: { onClose: () => void }) => {
    const [amount, setAmount] = useState<string>("");
    const { createWithdrawalRequest, isLoading } = useWallet();
    const { paymentMethods } = usePaymentMethod();
    const [userPaymentMethodId, setUserPaymentMethodId] = useState<string>(paymentMethods[0]?.id || "");
    const { showToast } = useToast();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!amount || !userPaymentMethodId){
            showToast("Please fill all the fields", "error");
            return;
        }
        try {
            const response = await createWithdrawalRequest(Number(amount), userPaymentMethodId);
            console.log(response);
            if(response.success){
                showToast("Withdrawal request created successfully", "success");
                onClose();
            } else {

                showToast(response.data.message, "error");
                onClose();
            }
        } catch (error: AxiosError | Error | unknown) {
            showToast(error instanceof AxiosError ? error.response?.data.message : error instanceof Error ? error.message : "An unknown error occurred", "error");
        }
        onClose();
    }
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black/50 px-2">
        <div className="flex flex-col gap-2 w-full md:w-2/3 lg:w-1/3 bg-white p-8 items-center rounded-3xl border border-gray-200">
            
        <div className="pb-6 border-b border-gray-200 flex justify-between w-full gap-4 items-center">
            <h2 className="text-xl font-semibold">Create Withdrawal Request</h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                <IoCloseOutline size={30}/>
            </button>
        </div>
        <div className="w-full flex flex-col gap-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label htmlFor="amount">Amount</label>
                <input 
                    type="number" 
                    id="amount" 
                    value={amount} 
                    min={1}
                    onChange={(e) => setAmount(e.target.value)} 
                    className="border border-gray-300 rounded-md p-2"
                />
                
                <select className="border border-gray-300 rounded-md p-2" value={userPaymentMethodId} onChange={(e) => setUserPaymentMethodId(e.target.value)}>
                    {paymentMethods.map((paymentMethod) => (
                        <option key={paymentMethod.id} value={paymentMethod.id}>{paymentMethod.type}</option>
                    ))}
                </select>
                <button 
                type="submit"
                disabled={isLoading}
                className="bg-[#7E37D8] text-white px-6 py-2 rounded-3xl flex items-center justify-center">
                    {isLoading ? <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Creating...</span> : "Create"}
            </button>
            </form>
        </div>
        </div>
    </div>  
  )
}

export default CreateWithdrawalRequest