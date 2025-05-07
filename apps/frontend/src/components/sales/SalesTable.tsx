import { useSales } from "../../hooks/useSales";
import { Sale } from "../../store/useSalesStore";
import Error from "../ui/Error";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useState } from "react";
import SaleSidePop from "./SaleSidePop";
import { CiSearch } from "react-icons/ci";
const SalesTable = () => {
    const { sales, isLoading, error } = useSales();
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<"ALL" | "DIGITAL_PRODUCT" | "TELEGRAM_PLAN">("ALL");
    const [sortBy, setSortBy] = useState<"name" | "date" | "amount">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
   
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

                <div className="flex justify-between items-start px-12">
                    <h1 className="text-2xl pb-10 px-12 font-bold text-[#1B3155]">Sales</h1>
                    {/* Search and Filter Section */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
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
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as "ALL" | "DIGITAL_PRODUCT" | "TELEGRAM_PLAN")}
                            className="px-4 py-2 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="ALL" className="text-sm">All Types</option>
                            <option value="DIGITAL_PRODUCT" className="text-sm">Digital Products</option>
                            <option value="TELEGRAM_PLAN" className="text-sm">Telegram Plans</option>
                        </select>

                        {/* Sort Options */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "name" | "date" | "amount")}
                            className="px-4 py-2 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="date" className="text-sm">Sort by Date</option>
                            <option value="name" className="text-sm">Sort by Name</option>
                            <option value="amount" className="text-sm">Sort by Amount</option>
                        </select>

                        {/* Sort Order Toggle */}
                        <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                        >
                            {sortOrder === "asc" ? "↑" : "↓"}
                        </button>
                    </div>
                </div>
                {/* tabular view */}
                <div className="overflow-x-scroll lg:overflow-x-hidden">
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
                </div>
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
            <td className="font-semibold px-4">{sale.productType === 'DIGITAL_PRODUCT' ? sale?.digitalProduct?.title : sale?.telegramPlan?.name}</td>
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