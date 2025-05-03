import { useRef, useState, useEffect } from "react";
import { useAdminKyc } from "../../hooks/useAdminKyc";
import UpdateKyc from "./UpdateKyc";
const KycDocumentSidePop = ({kycDocumentId, onClose}: {kycDocumentId: string, onClose: () => void}) => {
 
    const [isVisible, setIsVisible] = useState(false);
    const { fetchKycDocumentById, currentKycDocument } = useAdminKyc();
    

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    fetchKycDocumentById(kycDocumentId);
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

  const handleViewDocument = async () => {
    window.open(currentKycDocument?.presignedUrl, "_blank");
  }

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
            <h1 className="text-2xl font-bold text-[#7e37d8]">Kyc Document</h1>
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
              <p className="text-sm text-[#718096]">Kyc Document ID</p>
                <p className="font-medium">{currentKycDocument?.id}</p>
            </div>
            <div className="border-b pb-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">User ID</p>
                    <p className="font-medium text-sm">{currentKycDocument?.user.id}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Username:</p>
                    <p className="font-medium text-sm">{currentKycDocument?.user.username}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Email:</p>
                    <p className="font-medium text-sm">{currentKycDocument?.user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Name:</p>
                    <p className="font-medium text-sm">{currentKycDocument?.user.name}</p>
                </div>
            </div>
            <div className="border-b pb-3 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Document Type:</p>
                    <p className="font-medium text-sm">{currentKycDocument?.documentType}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Document Number:</p>
                    <p className="font-medium text-sm">{currentKycDocument?.documentNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Status:</p>
                    <p className="font-medium text-sm">{currentKycDocument?.status}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#718096]">Uploaded At:</p>
                    <p className="font-medium text-sm">{currentKycDocument?.createdAt}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleViewDocument}
                        className="bg-[#7F37D8] text-white px-4 py-2 rounded-md"
                    >
                        View Document
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <UpdateKyc />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KycDocumentSidePop