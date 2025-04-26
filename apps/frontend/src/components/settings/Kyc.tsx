import { useKyc } from "../../hooks/useKyc";
import { useState } from "react";
const Kyc = () => {
  const { kycDocument, isLoading, error, uploadDocument } = useKyc();
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");

  const handleUpload = async () => {
    if (file) {
      await uploadDocument(file, documentType, documentNumber);
      setFile(null);
      setDocumentType("");
      setDocumentNumber("");
    }
  }
  const handleViewDocument = async () => {
    window.open(kycDocument?.url, "_blank");
  }

  if(isLoading) {
    return <div>Loading...</div>;
  }
  if(error) {
    return <div>Error: {error}</div>;
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
        <div className="flex flex-col gap-2 pb-4 px-12">
          <h1 className="text-2xl  font-bold text-[#1B3155]">KYC</h1>
          <p className="text-sm text-gray-500">Upload your KYC document to verify your identity</p>
        </div>
        <div className="flex gap-4 p-12 pt-0">
          <div className="flex flex-col gap-4 w-1/3">
            <h1 className="text-xl font-semibold text-[#1B3155]">Upload KYC Document</h1>
            <div className="flex flex-col gap-2">
              <label>Document Type</label>
              <select 
                value={documentType} 
                onChange={(e) => setDocumentType(e.target.value)} 
                className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
              >
                <option value="PAN">PAN</option>
                <option value="PASSPORT">PASSPORT</option>
                <option value="DRIVERS_LICENSE">DRIVERS_LICENSE</option>
                <option value="NATIONAL_ID">NATIONAL_ID</option>
                <option value="VOTER_ID">VOTER_ID</option>
                <option value="TAX_ID">TAX_ID</option>
                <option value="UTILITY_BILL">UTILITY_BILL</option>
                <option value="BANK_STATEMENT">BANK_STATEMENT</option>
                <option value="OTHER">OTHER</option>  
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label>Document Number</label>
              <input 
                type="text" 
                value={documentNumber} 
                onChange={(e) => setDocumentNumber(e.target.value)} 
                className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
              />
            </div>
            <div>
              <input 
              type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <button 
              onClick={handleUpload}
              className="bg-[#7F37D8] text-white px-4 py-2 rounded-md"
            >
              Upload
            </button>
          </div>
          <div className="flex flex-col gap-4 w-2/3 p-4">
            <h1 className="text-xl font-semibold text-[#1B3155]">KYC Document</h1>
            <p>Document Type: {kycDocument?.documentType}</p>
            <p>Document ID: {kycDocument?.documentNumber}</p>
            <p>Document Status: {kycDocument?.status}</p>
            <button 
              onClick={handleViewDocument}
              className="bg-[#7F37D8] text-white px-4 py-2 rounded-md"
            >
              View Document
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Kyc