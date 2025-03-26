import { useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";

interface VerifyTelegramCodeProps {
  phoneNumber: string;
  onSuccess: () => void;
}

const VerifyTelegramCode = ({ phoneNumber, onSuccess }: VerifyTelegramCodeProps) => {
  const [code, setCode] = useState("");
  const { verifyOtp, isLoading, error } = useTelegram();

  const handleVerify = async () => {
    try {
      console.log(phoneNumber, code);
      await verifyOtp(code, phoneNumber);
      onSuccess();
    } catch {
      console.log("Error verifying code");
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-left">
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-medium text-gray-700 text-left" htmlFor="verification-code">
          Verification Code
        </label>
        <div className="flex flex-row gap-2">
          <input
            type="text"
            id="verification-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter the code sent to your phone"
            className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="flex justify-between gap-2">
        <button
          onClick={handleVerify}
          disabled={isLoading || !code}
          className="bg-[#7F37D8] text-white mt-4 py-2 px-4 w-40 rounded-3xl hover:bg-[#6C2EB9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>
      </div>
    </div>
  );
};

export default VerifyTelegramCode; 