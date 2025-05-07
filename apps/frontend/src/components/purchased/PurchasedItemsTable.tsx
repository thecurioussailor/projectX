import { useEffect, useState } from "react";
import { usePurchasedItems } from "../../hooks/usePurchasedItems";
import LoadingSpinner from "../ui/LoadingSpinner";
import Error from "../ui/Error";
import { useNavigate } from "react-router-dom";
import PurchasedItemSidePop from "./PurchasedItemSidePop";
import { DigitalFile } from "../../store/usePurchasedItemsStore";
import { CiSearch } from "react-icons/ci";

export interface DigitalPurchase {
    id: string;
    userId: number;
    productId: string;
    product: {
        title: string
    };
    purchaseDate: string;      // ISO timestamp
    price: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;         // ISO timestamp
    updatedAt: string;         // ISO timestamp
    files?: DigitalFile[];     // Optional files property for downloaded files
}

export interface TelegramSubscription {
    id: string;
    planId: string;
    userId: string;
    telegramUsername: string;
    planName: string;
    planPrice: number;
    planDuration: number;
    expiryDate: string;
    inviteLink: string;
    status: 'ACTIVE' | 'EXPIRED';
    createdAt: string;
  }
type PurchasedItem = TelegramSubscription | DigitalPurchase;

// Add this new type guard function
export const isTelegramSubscription = (item: PurchasedItem): item is TelegramSubscription => {
    return "planName" in item;
};

const PurchasedItemsTable = () => {
    const { telegramSubscriptions, digitalPurchases, isLoading, error, getPurchasedItems } = usePurchasedItems();
    const [ purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<"ALL" | "TELEGRAM_PLAN" | "DIGITAL_PRODUCT">("ALL");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED">("ALL");
    const [sortBy, setSortBy] = useState<"name" | "date" | "amount">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    useEffect(() => {
        getPurchasedItems();
    }, [getPurchasedItems]);  
    
    useEffect(() => {
        if (!isLoading && !error) {
          setPurchasedItems([
            ...telegramSubscriptions,
            ...digitalPurchases
          ]);
        }
      }, [telegramSubscriptions, digitalPurchases, isLoading, error]);

      // Filter and sort purchased items
    const filteredAndSortedItems = purchasedItems
    .filter(item => {
        const isSub = isTelegramSubscription(item);
        const matchesSearch = isSub 
            ? item.planName.toLowerCase().includes(searchQuery.toLowerCase())
            : item.product.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = typeFilter === "ALL" || 
            (typeFilter === "TELEGRAM_PLAN" && isSub) ||
            (typeFilter === "DIGITAL_PRODUCT" && !isSub);
        
        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
        
        return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
        if (sortBy === "name") {
            const nameA = isTelegramSubscription(a) ? a.planName : a.product.title;
            const nameB = isTelegramSubscription(b) ? b.planName : b.product.title;
            return sortOrder === "asc" 
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
        }
        if (sortBy === "date") {
            const dateA = isTelegramSubscription(a) ? new Date(a.createdAt) : new Date(a.purchaseDate);
            const dateB = isTelegramSubscription(b) ? new Date(b.createdAt) : new Date(b.purchaseDate);
            return sortOrder === "asc" 
                ? dateA.getTime() - dateB.getTime()
                : dateB.getTime() - dateA.getTime();
        }
        if (sortBy === "amount") {
            const amountA = isTelegramSubscription(a) ? a.planPrice : Number(a.price);
            const amountB = isTelegramSubscription(b) ? b.planPrice : Number(b.price);
            return sortOrder === "asc" 
                ? amountA - amountB
                : amountB - amountA;
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

    if (telegramSubscriptions.length === 0 && digitalPurchases.length === 0) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <p className="text-gray-600">No purchased items found</p>
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
                <div className="flex justify-between items-start px-12">
                <h1 className="text-2xl pb-10 font-bold px-12 text-[#1B3155]">Purchased</h1>
                    {/* Search and Filter Section */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                            <CiSearch size={20} className="absolute left-3 top-3 text-gray-400"/>
                        </div>

                        {/* Type Filter */}
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as "ALL" | "TELEGRAM_PLAN" | "DIGITAL_PRODUCT")}
                            className="px-4 py-2 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="ALL" className="text-sm">All Types</option>
                            <option value="TELEGRAM_PLAN" className="text-sm">Telegram Plans</option>
                            <option value="DIGITAL_PRODUCT" className="text-sm">Digital Products</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED")}
                            className="px-4 py-2 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="ALL" className="text-sm">All Status</option>
                            <option value="ACTIVE" className="text-sm">Active</option>
                            <option value="INACTIVE" className="text-sm">Inactive</option>
                            <option value="EXPIRED" className="text-sm">Expired</option>
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
                <div className="overflow-x-auto lg:overflow-x-hidden">
                    <table className="w-full text-left min-w-max lg:min-w-full">
                        <thead className="border-gray-300 h-20 text-[#1B3155]">
                            <tr className="border-t border-gray-200">
                                <th className="lg:w-1/12 px-8">#</th>
                                <th className="lg:w-2/12 px-4">Item Name</th>
                                <th className="lg:w-1/12 px-4">Type</th>
                                <th className="lg:w-1/12 px-4">Status</th>
                                <th className="lg:w-1/12 px-4">Amount (INR)</th>
                                <th className="lg:w-1/12 px-4">Purchase Date</th>
                                <th className="lg:w-1/12 px-4">Expiry Date</th>
                                <th className="lg:w-1/12 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedItems.map((item, index) => (
                                <PurchasedItemRow key={item.id} item={item} index={index} />
                            ))}    
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PurchasedItemRow = ({ item, index }: { item: PurchasedItem, index: number }) => {
    const isSub = "planName" in item;
    const navigate = useNavigate(); 
    const [isSidePopOpen, setIsSidePopOpen] = useState(false);
    const handleRowClick = () => {
        if (isSub) {
            window.open(item.inviteLink, "_blank", "noopener,noreferrer");
        }else{
            navigate(`/purchased-digital-products/${item.id}`);
        }
    };
    
    return (
        <tr 
            className="border-t border-gray-200 h-20 hover:bg-gray-50"
        >
            <td className="px-8">{index + 1}</td>
            <td className="px-4">{isSub ? item.planName : item.product.title /* or a name prop */}</td>
            <td className="px-4">
                <span className="bg-[#E7F3FE] text-[#158DF7] text-xs font-semibold rounded-full px-2 py-1">{isSub ? "TELEGRAM_PLAN" : "DIGITAL_PRODUCT"}</span>
            </td>
            <td className="px-4">
                <div className={`border w-fit px-2 flex items-center gap-2 py-1 rounded-full`}><div className={`${item.status === "ACTIVE" ? "bg-green-500": "bg-red-500"} w-2 h-2 rounded-full`}></div><span className="text-xs">{item.status === "ACTIVE" ? "Active" : "Inactive"}</span></div>
            </td>
            <td className="px-4">{isSub ? item.planPrice : item.price}</td>
            <td className="px-4">{new Date(
          isSub ? item.createdAt : item.purchaseDate
        ).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</td>
            <td className="px-4">{isSub
          ? new Date(item.expiryDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })
          : "–"}</td>
            <td className="px-4">
                <button 
                    onClick={() => setIsSidePopOpen(true)}
                    className="flex items-center gap-2 bg-[#7F37D8] rounded-full text-white px-4 py-2">
                    View
                </button>
                {isSidePopOpen && <PurchasedItemSidePop purchasedItem={item} onClose={() => setIsSidePopOpen(false)} isSub={isSub} handle={() => handleRowClick()}/>}
            </td>
        </tr>
    );
};

export default PurchasedItemsTable;
