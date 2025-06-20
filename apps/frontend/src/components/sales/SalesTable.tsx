import { useSales } from "../../hooks/useSales";
import { Sale } from "../../store/useSalesStore";
import Error from "../ui/Error";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useState, useEffect } from "react";
import SaleSidePop from "./SaleSidePop";
import { CiCircleList, CiGrid41, CiSearch } from "react-icons/ci";
import { FaDownload } from "react-icons/fa";
import { useToast } from "../ui/Toast";
const SalesTable = () => {
    const { sales, isLoading, error } = useSales();
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<"ALL" | "DIGITAL_PRODUCT" | "TELEGRAM_PLAN">("ALL");
    const [sortBy, setSortBy] = useState<"name" | "date" | "amount">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [isGridView, setIsGridView] = useState(() => {
        return window.innerWidth < 1024;
    });
    const { showToast } = useToast();

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
   
    // Filter and sort sales
    const filteredAndSortedSales = sales
        ?.filter(sale => {
            const matchesSearch = 
                (sale.productType === 'DIGITAL_PRODUCT' 
                    ? sale.digitalProduct?.title?.toLowerCase() ?? ""
                    : sale.telegramPlan?.name?.toLowerCase() ?? ""
                ).includes(searchQuery.toLowerCase()) ||
                sale.user.username.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesType = typeFilter === "ALL" || sale.productType === typeFilter;
            
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            if (sortBy === "name") {
                const nameA = a.productType === 'DIGITAL_PRODUCT' ? a.digitalProduct?.title : a.telegramPlan?.name;
                const nameB = b.productType === 'DIGITAL_PRODUCT' ? b.digitalProduct?.title : b.telegramPlan?.name;
                return sortOrder === "asc" 
                    ? (nameA ?? "").localeCompare(nameB ?? "")
                    : (nameB ?? "").localeCompare(nameA ?? "");
            }
            if (sortBy === "date") {
                return sortOrder === "asc" 
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === "amount") {
                return sortOrder === "asc" 
                    ? Number(a.amount) - Number(b.amount)
                    : Number(b.amount) - Number(a.amount);
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

    if (error) {
        return (
            <Error error={"error"} />
        );
    }

    if (!sales || sales.length === 0) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <p className="text-gray-600">No sale till now</p>
            </div>
        );
    }

    const exportToCSV = () => {
        if (!filteredAndSortedSales || filteredAndSortedSales.length === 0) {
            showToast("No data to export", "error");
            return;
        }

        // Define CSV headers
        const headers = [
            "S.No",
            "Item Name", 
            "Item Type",
            "Price (INR)",
            "Date",
            "Username",
            "Status",
            "Transaction ID"
        ];

        // Convert sales data to CSV rows
        const csvRows = [
            headers.join(','), // Header row
            ...filteredAndSortedSales.map((sale, index) => [
                index + 1,
                `"${sale.productType === 'DIGITAL_PRODUCT' ? sale.digitalProduct?.title || '' : sale.telegramPlan?.name || ''}"`,
                sale.productType,
                sale.amount,
                new Date(sale.createdAt).toLocaleDateString("en-US", { 
                    year: "numeric", 
                    month: "2-digit", 
                    day: "2-digit" 
                }),
                sale.user.username,
                sale.status,
                sale.id
            ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        
        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sales_data_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
  return (
    <div className="flex justify-between gap-4 bg-white rounded-[3rem] w-full overflow-clip shadow-lg shadow-purple-100 mb-10">
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
                    <h1 className="text-2xl pb-10 px-12 font-bold text-[#1B3155]">Sales</h1>
                    {/* Search and Filter Section */}
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                        {/* Search Bar */}
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search sales..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                                <CiSearch size={20} className="absolute left-3 top-3 text-gray-400"/>
                            </div>

                            {/* Type Filter */}
                            <div className="relative">
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value as "ALL" | "DIGITAL_PRODUCT" | "TELEGRAM_PLAN")}
                                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
                                >
                                    <option value="ALL" className="text-sm">All Types</option>
                                    <option value="DIGITAL_PRODUCT" className="text-sm">Digital Products</option>
                                    <option value="TELEGRAM_PLAN" className="text-sm">Telegram Plans</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                            {/* Sort Options */}
                            <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as "name" | "date" | "amount")}
                                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
                                >
                                    <option value="date" className="text-sm">Sort by Date</option>
                                    <option value="name" className="text-sm">Sort by Name</option>
                                    <option value="amount" className="text-sm">Sort by Amount</option>
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

                        <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors duration-200"
                                title="Export to CSV"
                            >
                                <FaDownload size={16} />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        <div className="cursor-pointer flex items-center gap-2">
                            <button 
                            className={`${isGridView ? "bg-gray-200" : "bg-white"} p-2 rounded-full`}
                            onClick={() => setIsGridView(true)}
                            >
                                <CiGrid41 size={20} />
                            </button>
                            <button 
                            className={`${isGridView ? "bg-white" : "bg-gray-200"} p-2 rounded-full`}
                            onClick={() => setIsGridView(false)}
                            >
                                <CiCircleList size={20} />
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
                {/* Grid View */}
                {isGridView && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-10">
                    {filteredAndSortedSales?.map((sale, index) => (
                        <SalesTableCard key={index} sale={sale} index={index} />
                    ))}
                </div>}
                {/* tabular view */}
                {!isGridView && <div className="overflow-x-scroll lg:overflow-x-hidden">
                    <table className="w-full text-left min-w-max lg:min-w-full">
                        <thead className=" border-gray-300 h-20">
                            <tr className="border-t border-gray-200 text-[#1B3155]">
                                <th className="lg:w-1/12 px-8">#</th>
                                <th className="lg:w-2/12 px-4">Item Name</th>
                                <th className="lg:w-1/12 px-4">Item Type</th>
                                <th className="lg:w-1/12 px-4">Price(INR)</th>
                                <th className="lg:w-1/12 px-4">Date</th>
                                <th className="lg:w-1/12 px-4">Username</th>
                                <th className="lg:w-1/12 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedSales?.map((sale, index) => (
                                <SalesTableRow key={index} sale={sale} index={index} />
                            ))}  
                        </tbody>
                    </table>
                </div>}
            </div>
        </div>
    )
}

export default SalesTable

const SalesTableRow = ({sale, index}: {sale: Sale, index: number}) => {
    const [isSidePopOpen, setIsSidePopOpen] = useState(false);
    return (
        <tr className="border-t border-gray-200 h-20 text-[#1B3155] hover:bg-gray-50">
            <td className="px-8">{index + 1}</td>
            <td className="px-4">{sale.productType === 'DIGITAL_PRODUCT' ? (sale?.digitalProduct?.title?.length && sale?.digitalProduct?.title?.length > 30 ? sale?.digitalProduct?.title?.slice(0, 30) + "..." : sale?.digitalProduct?.title) : ((sale?.telegramPlan?.name?.length && sale?.telegramPlan?.channel?.channelName?.length) && (sale?.telegramPlan?.name?.length + sale?.telegramPlan?.channel?.channelName?.length) > 30 ? (sale?.telegramPlan?.name + " " + sale?.telegramPlan?.channel?.channelName).slice(0, 30) + "..." : sale?.telegramPlan?.name + " " + `( ${sale?.telegramPlan?.channel?.channelName} )`)}</td>
            <td className="px-4"><span className="bg-[#E7F3FE] text-[#158DF7] text-xs font-semibold rounded-full px-2 py-1">{sale.productType}</span></td>
            <td className="px-4">{sale.amount}</td>
            <td className="px-4">{new Date(sale.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</td>
            <td className="text-[#158DF7] font-semibold px-4">{sale.user.username}</td>
            <td className="px-4">
                <button 
                onClick={() => setIsSidePopOpen(true)}
                className="text-white bg-[#7e37d8] px-4 py-2 rounded-full">
                    View
                </button>
                {isSidePopOpen && <SaleSidePop sale={sale} onClose={() => setIsSidePopOpen(false)} />}
            </td>
        </tr>
    )
}

const SalesTableCard = ({sale, index}: {sale: Sale, index: number}) => {
    const [isSidePopOpen, setIsSidePopOpen] = useState(false);
    
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1B3155]">#{index + 1}</span>
                    <span className="bg-[#E7F3FE] text-[#158DF7] text-xs font-semibold rounded-full px-3 py-1">
                        {sale.productType.replace('_', ' ')}
                    </span>
                </div>
                <span className="text-sm text-gray-500">
                    {new Date(sale.createdAt).toLocaleDateString("en-US", { 
                        month: "short", 
                        day: "numeric",
                        year: "numeric"
                    })}
                </span>
            </div>

            {/* Product Name */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#1B3155] line-clamp-2">
                    {sale.productType === 'DIGITAL_PRODUCT' ? sale?.digitalProduct?.title : sale?.telegramPlan?.name}
                </h3>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price</span>
                    <span className="text-lg font-bold text-[#7e37d8]">₹{sale.amount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer</span>
                    <span className="text-sm font-medium text-[#158DF7]">{sale.user.username}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm font-medium text-green-600">{sale.status}</span>
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
            {isSidePopOpen && <SaleSidePop sale={sale} onClose={() => setIsSidePopOpen(false)} />}
        </div>
    )
}