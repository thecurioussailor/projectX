import { useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";

const SendTelegramCode = ({ onPhoneNumberChange, onSuccess }: { onPhoneNumberChange: (phoneNumber: string) => void, onSuccess: () => void }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const { sendOtp, isLoading, error } = useTelegram();

    const handleGetCode = async () => {
        try {
            await sendOtp(phoneNumber);
            onPhoneNumberChange(phoneNumber);
            onSuccess();
        } catch {
            console.log("Error sending OTP");
        }
    };
  return (
    <div className="flex flex-col gap-2 justify-center items-left">
        <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-gray-700 text-left" htmlFor="telegram-phone-number">
                Phone Number
            </label>
            <div className="flex flex-row gap-2">
                <input
                    type="tel"
                    id="telegram-phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number with country code"
                    className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                    required
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex justify-between gap-2">
            <button
                onClick={handleGetCode}
                disabled={isLoading || !phoneNumber}
                className="bg-[#7F37D8] text-white mt-4 py-2 px-4 w-40 rounded-3xl hover:bg-[#6C2EB9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Sending..." : "Get Code"}
            </button>
        </div>
    </div>
  )
}

export default SendTelegramCode