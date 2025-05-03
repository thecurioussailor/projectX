import { useState } from "react";
import { useAdminKyc } from "../../hooks/useAdminKyc";
import { FaSpinner } from "react-icons/fa";

const UpdateKyc = () => {
    const { currentKycDocument } = useAdminKyc();
    const [status, setStatus] = useState<string>("PENDING");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { updateKycDocumentById } = useAdminKyc();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentKycDocument?.id) {
            return;
        }
        setIsLoading(true);
        await updateKycDocumentById(currentKycDocument?.id, status);
        setIsLoading(false);
    }
  return (
    <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl font-bold">Update Kyc Document</h1> 
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <select 
                value={status}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#7F37D8] focus:border-transparent" 
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="RESUBMIT_REQUESTED">Resubmit Requested</option>
            </select>
            <button type="submit" className="bg-[#7F37D8] text-white px-4 py-2 rounded-md" disabled={isLoading}>{isLoading ? <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Updating...</span> : "Update"}</button>
        </form>
    </div>
  )
}

export default UpdateKyc