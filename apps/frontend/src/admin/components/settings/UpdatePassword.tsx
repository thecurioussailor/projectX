import { useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { FaSpinner } from "react-icons/fa";
const UpdatePassword = () => {
    const { updatePassword } = useAdmin();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if(oldPassword === newPassword) {
            setIsLoading(false);
            return;
        }
        if(newPassword !== confirmPassword) {
            setIsLoading(false);
            return;
        }
        await updatePassword(oldPassword, newPassword, confirmPassword);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsLoading(false);
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
        <h1 className="text-2xl pb-10 px-12 font-bold text-[#1B3155]">Update Password</h1>
        <div className="px-12 pb-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <label htmlFor="oldPassword">Old Password</label>
                    <input 
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        type="password" 
                        id="oldPassword" 
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#7F37D8] focus:border-transparent" />
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="newPassword">New Password</label>
                    <input 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password" 
                        id="newPassword" 
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#7F37D8] focus:border-transparent" />
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password" 
                        id="confirmPassword" 
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#7F37D8] focus:border-transparent" />
                </div>
                <button type="submit" className="bg-[#7F37D8] text-white px-4 py-2 rounded-md" disabled={isLoading}>{isLoading ? <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Updating...</span> : "Update Password"}</button>
            </form>
        </div>
    </div>
</div>
  )
}

export default UpdatePassword