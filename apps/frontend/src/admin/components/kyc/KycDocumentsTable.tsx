import { AdminKycDocument } from "../../store/useAdminKycStore";
import { useAdminKyc } from "../../hooks/useAdminKyc";
import { useState } from "react";
import KycDocumentSidePop from "./KycDocumentSidePop";
const KycDocumentsTable = () => {
  const { kycDocument } = useAdminKyc();

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
        <h1 className="text-2xl pb-10 px-12 font-bold text-[#1B3155]">Kyc Approval Requests</h1>
        {/* tabular view */}
        <div className="overflow-x-scroll lg:overflow-x-hidden">
        <table className="w-full text-left min-w-max lg:min-w-full">
            <thead className=" border-gray-300 h-20">
                <tr className="border-t border-gray-200 text-[#1B3155]">
                    <th className="lg:w-1/12 px-8">#</th>
                    <th className="lg:w-1/12 px-4">Name</th>
                    <th className="lg:w-1/12 px-4">Email</th>
                    <th className="lg:w-1/12 px-4">Username</th>
                    <th className="lg:w-1/12 px-4">Document Type</th>
                    <th className="lg:w-1/12 px-4">Document Number</th>
                    <th className="lg:w-1/12 px-4">Status</th>
                    <th className="lg:w-1/12 px-4">Action</th>
                </tr>
            </thead>
            <tbody>
                {kycDocument?.map((kycDocument, index) => (
                    <KycDocumentsTableRow key={index} kycDocument={kycDocument} index={index} />
                ))}
            </tbody>
        </table>
        </div>
    </div>
</div>
  )
}

export default KycDocumentsTable

const KycDocumentsTableRow = ({kycDocument, index}: {kycDocument: AdminKycDocument, index: number}) => {
    const [isSidePopOpen, setIsSidePopOpen] = useState(false);
        return (
            <tr className="border-t  border-gray-200 h-20 text-[#1B3155]">
                <td className="px-8">{index + 1}</td>
                <td className="font-semibold px-4">{kycDocument.user.name}</td>
                <td className="px-4">{kycDocument.user.email}</td>
                <td className="px-4">{kycDocument.user.username}</td>
                <td className="px-4">{kycDocument.documentType}</td>
                <td className="px-4">{kycDocument.documentNumber}</td>
                <td className="px-4"><div className={`border w-fit px-2 flex items-center gap-2 py-1 rounded-full`}><div className={`${kycDocument.status === "APPROVED" ? "bg-green-500" : kycDocument.status === "REJECTED" ? "bg-red-500" : "bg-yellow-500"} w-2 h-2 rounded-full`}></div><span className="text-xs">{kycDocument.status}</span></div></td>
                <td className="px-4">
                    <button 
                    onClick={() => setIsSidePopOpen(true)}
                    className="text-white bg-[#7e37d8] px-4 py-2 rounded-full">
                        View
                    </button>
                    {isSidePopOpen && <KycDocumentSidePop kycDocumentId={kycDocument.id} onClose={() => setIsSidePopOpen(false)} />}
                </td>
            </tr>
        )
}