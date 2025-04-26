import { Transaction } from "../../store/useTransactionStore";
import { useEffect, useState } from "react";

const TransactionSidePop = ({ transaction, onClose }: { transaction: Transaction, onClose: () => void }) => {
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
            <h1 className="text-2xl font-bold text-[#7e37d8]">Transaction Details</h1>
            <button 
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="border-b pb-3">
              <p className="text-sm text-[#718096]">Transaction ID</p>
              <p className="font-medium">{transaction.id}</p>
            </div>
            <div className="border-b pb-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Gateway:</p>
                    <p className="font-medium text-sm">{transaction.gateway}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Gateway Transaction ID:</p>
                    <p className="font-medium text-sm">{transaction.gatewayTxnId}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Amount:</p>
                    <p className="font-medium text-sm">{transaction.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Status:</p>
                    <p className="font-medium text-sm">{transaction.status}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Payment Group:</p>
                    <p className="font-medium text-sm">{transaction.paymentGroup}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Payment Time:</p>
                    <p className="font-medium text-sm">{new Date(transaction.paymentTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Created At:</p>
                    <p className="font-medium text-sm">{new Date(transaction.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                </div>
            </div>
            <div className="border-b pb-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">User ID:</p>
                    <p className="font-medium text-sm">{transaction.order?.user?.id}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Username:</p>
                    <p className="font-medium text-sm">{transaction.order?.user?.username}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Name:</p>
                    <p className="font-medium text-sm">{transaction.order?.user?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Email:</p>
                    <p className="font-medium text-sm">{transaction.order?.user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Phone:</p>
                    <p className="font-medium text-sm">{transaction.order?.user?.phone}</p>
                </div>
            </div>
            <div className="border-b pb-3">
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Order ID:</p>
                    <p className="font-medium text-sm">{transaction.order?.id}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Product Type:</p>
                    <p className="font-medium text-sm">{transaction.order?.productType}</p>
                </div>
                
            </div>
            <div className="border-b pb-3">
                {transaction.order?.productType === 'DIGITAL_PRODUCT' && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[#718096]">Digital Product:</p>
                            <p className="font-medium text-sm">{transaction.order?.digitalProduct?.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[#718096]">Product ID:</p>
                            <p className="font-medium text-sm">{transaction.order?.digitalProduct?.id}</p>
                        </div>
                    </div>
                )}
                {transaction.order?.productType === 'TELEGRAM_PLAN' && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[#718096]">Telegram Plan:</p>
                            <p className="font-medium text-sm">{transaction.order?.telegramPlan?.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[#718096]">Product ID:</p>
                            <p className="font-medium text-sm">{transaction.order?.telegramPlan?.id}</p>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSidePop;