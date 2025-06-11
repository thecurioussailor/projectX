import { useState, useEffect } from "react";
import { useWallet } from "../../hooks/useWallet";
import { WithdrawalRequest } from "../../store/useWalletStore";
import LoadingSpinner from "../ui/LoadingSpinner";
import WithdrawalRequestSidePop from "./WithdrawalRequestSidePop";
import { CiCircleList, CiGrid41, CiSearch } from "react-icons/ci";

const WidrawalRequestsTable = () => {
    const { withdrawalRequests, isLoading } = useWallet();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"amount" | "date" | "status">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");   
    const [isGridView, setIsGridView] = useState(() => {
        return window.innerWidth < 1024;
    });

    useEffect(() => {
        const handleResize = () => {
            const isMobileOrTablet = window.innerWidth < 1024;
            
            if (isMobileOrTablet && !isGridView) {
                setIsGridView(true);
            } else if (!isMobileOrTablet && isGridView) {
                setIsGridView(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isGridView]);

    // Filter and sort withdrawal requests
    const filteredAndSortedWithdrawalRequests = withdrawalRequests
        ?.filter(withdrawalRequest => {
            const matchesSearch = 
                withdrawalRequest.amount.toString().includes(searchQuery.toLowerCase()) ||
                withdrawalRequest.status.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === "amount") {
                return sortOrder === "asc" 
                    ? a.amount - b.amount
                    : b.amount - a.amount;
            }
            if (sortBy === "date") {
                return sortOrder === "asc" 
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === "status") {
                return sortOrder === "asc" 
                    ? a.status.localeCompare(b.status)
                    : b.status.localeCompare(a.status);
            }
            return 0;
        });

    if (isLoading) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!withdrawalRequests || withdrawalRequests.length === 0) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <p className="text-gray-600">No withdrawable request found</p>
            </div>
        );
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
            <div className="flex flex-col lg:flex-row justify-between items-start px-12">
                <div className="flex flex-col gap-2 pb-10">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-[#1B3155]">Withdrawal Requests</span>
                    </div>
                    <p className="text-gray-500 text-sm">Manage your withdrawal requests</p>
                </div>
                {/* Search and Filter Section */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search withdrawal requests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        <CiSearch size={20} className="absolute left-3 top-3 text-gray-400"/>
                    </div>

                    {/* Sort Options */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "amount" | "date" | "status")}
                            className="appearance-none px-4 py-2 pr-10 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="amount">Sort by Amount</option>
                            <option value="status">Sort by Status</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Sort Order Toggle */}
                    <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                    >
                        {sortOrder === "asc" ? "↑" : "↓"}
                    </button>

                    <div className="cursor-pointer flex items-center gap-2">
                        <button 
                        className={`${isGridView ? "bg-gray-200" : "bg-white"} p-2 rounded-full`}
                        onClick={() => setIsGridView(true)}
                        >
                            <CiCircleList size={20} />
                        </button>
                        <button 
                        className={`${isGridView ? "bg-white" : "bg-gray-200"} p-2 rounded-full`}
                        onClick={() => setIsGridView(false)}
                        >
                            <CiGrid41 size={20} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Grid View */}
            {isGridView && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-10">
                {filteredAndSortedWithdrawalRequests?.map((withdrawalRequest, index) => (
                    <WithdrawalRequestCard key={withdrawalRequest.id} withdrawalRequest={withdrawalRequest} index={index} />
                ))}
            </div>}
            {/* Table view */}
            {!isGridView && <div className="overflow-x-scroll lg:overflow-x-hidden">         
                <table className="w-full text-left min-w-max lg:min-w-full">
                    <thead className=" border-gray-300 h-20">
                        <tr className="border-t border-gray-200">
                            <th className="lg:w-1/12 px-8">#</th>
                            <th className="lg:w-1/12 px-4">Amount (INR)</th>
                            <th className="lg:w-1/12 px-4">Status</th>
                            <th className="lg:w-1/12 px-4">Created</th>
                            <th className="lg:w-1/12 px-4">Processed</th>
                            <th className="lg:w-1/12 px-4">Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedWithdrawalRequests?.map(( withdrawalRequest, index) => (
                            <WithdrawalRequestRow key={withdrawalRequest.id} withdrawalRequest={withdrawalRequest} index={index} />
                        ))}
                    </tbody>
                </table> 
            </div>}
        </div>
    </div>
  )
}

export default WidrawalRequestsTable

const WithdrawalRequestRow = ({ withdrawalRequest, index }: { withdrawalRequest: WithdrawalRequest, index: number }) => {
    const [isSidePopOpen, setIsSidePopOpen] = useState(false);
    return (
        <tr className="border-t border-gray-200 h-20">
            <td className="px-8">{index + 1}</td>
            <td className="px-4">{withdrawalRequest.amount}</td>
            <td className="px-4"><div className={`border w-fit px-2 flex items-center gap-2 py-1 rounded-full`}><div className={`${withdrawalRequest.status === "PAID" ? "bg-green-500": "bg-red-500"} w-2 h-2 rounded-full`}></div><span className="text-xs">{withdrawalRequest.status}</span></div></td>
            <td className="px-4">{new Date(withdrawalRequest.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })}</td>
            <td className="px-4">{withdrawalRequest.processedAt ? new Date(withdrawalRequest.processedAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }) : "N/A"}</td>
            <td className="px-4">
                <button 
                onClick={() => setIsSidePopOpen(true)}
                className="text-white bg-[#7e37d8] px-4 py-2 rounded-full">
                    View
                </button>
                {isSidePopOpen && <WithdrawalRequestSidePop withdrawalRequest={withdrawalRequest} onClose={() => setIsSidePopOpen(false)} />}
            </td>
        </tr>
    )
}

const WithdrawalRequestCard = ({withdrawalRequest, index}: {withdrawalRequest: WithdrawalRequest, index: number}) => {
    const [isSidePopOpen, setIsSidePopOpen] = useState(false);
    
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1B3155]">#{index + 1}</span>
                </div>
                <span className="text-sm text-gray-500">
                    {new Date(withdrawalRequest.createdAt).toLocaleDateString("en-US", { 
                        month: "short", 
                        day: "numeric",
                        year: "numeric"
                    })}
                </span>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="text-lg font-bold text-[#7e37d8]">₹{withdrawalRequest.amount}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex items-center gap-2">
                        <div className={`${withdrawalRequest.status === "PAID" ? "bg-green-500": "bg-red-500"} w-2 h-2 rounded-full`}></div>
                        <span className="text-sm font-medium">{withdrawalRequest.status}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Processed</span>
                    <span className="text-sm font-medium">{withdrawalRequest.processedAt ? new Date(withdrawalRequest.processedAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }) : "N/A"}</span>
                </div>
            </div>

            {/* Action Button */}
            <button 
                onClick={() => setIsSidePopOpen(true)}
                className="w-full bg-[#7e37d8] hover:bg-[#6b2db5] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
                View Details
            </button>

            {/* Side Pop Modal */}
            {isSidePopOpen && <WithdrawalRequestSidePop withdrawalRequest={withdrawalRequest} onClose={() => setIsSidePopOpen(false)} />}
        </div>
    )
}
