import { useEffect, useRef, useState } from "react";
import { Withdrawal } from "../../store/useWithdrawalStore";
import ApproveWithdrawRequest from "./ApproveWithdrawRequest";
const PayoutSidePop = ({ withdrawal, onClose }: { withdrawal: Withdrawal, onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow animation to complete
    setTimeout(onClose, 300);
  };

  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-stretch z-50 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white w-full max-w-sm h-full overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out transform ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#7e37d8]">Payout Request</h1>
            <button 
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref={printRef} className="space-y-4">
            <div className="border-b pb-3">
              <p className="text-sm text-[#718096]">Withdrawal ID</p>
              <p className="font-medium">{withdrawal.id}</p>
            </div>
            <div className="border-b pb-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Wallet ID</p>
                    <p className="font-medium text-sm">{withdrawal.wallet.id}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Amount:</p>
                    <p className="font-medium text-sm">{withdrawal.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Status:</p>
                    <p className="font-medium text-sm">{withdrawal.status}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Created At:</p>
                    <p className="font-medium text-sm">{new Date(withdrawal.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                </div>
            </div>
            <div className="border-b pb-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">User ID:</p>
                    <p className="font-medium text-sm">{withdrawal.wallet.user.id}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Username:</p>
                    <p className="font-medium text-sm">{withdrawal.wallet.user.username}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Email:</p>
                    <p className="font-medium text-sm">{withdrawal.wallet.user.email}</p>
                </div>
            </div>
            <div className="border-b pb-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Payment Method:</p>
                    <p className="font-medium text-sm">{withdrawal.paymentMethod}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Bank Name:</p>
                    <p className="font-medium text-sm">{withdrawal.paymentDetails?.bankName}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Account Number:</p>
                    <p className="font-medium text-sm">{withdrawal.paymentDetails?.accountNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Transaction ID:</p>
                    <p className="font-medium text-sm">{withdrawal.transactionId}</p>
                </div>
            </div>
            <div className="border-b pb-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                        <p className="text-xs text-[#718096]">Admin Notes:</p>
                        <p className="font-medium text-sm">{withdrawal.adminNotes}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Processed At:</p>
                    <p className="font-medium text-sm">{withdrawal.processedAt}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Processed By:</p>
                    <p className="font-medium text-sm">{withdrawal.processedBy}</p>
                </div>
            </div>
            <div className="border-b pb-3 flex flex-col gap-2">
                <ApproveWithdrawRequest withdrawalId={withdrawal.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutSidePop;