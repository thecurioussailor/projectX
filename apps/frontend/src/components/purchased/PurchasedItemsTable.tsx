import { useEffect, useState } from "react";
import { usePurchasedItems } from "../../hooks/usePurchasedItems";
import LoadingSpinner from "../ui/LoadingSpinner";
import Error from "../ui/Error";
import { PurchaseItem } from "../../store/usePurchasedItemsStore";
import { useNavigate } from "react-router-dom";
const PurchasedItemsTable = () => {
    const { telegramSubscriptions, digitalPurchases, isLoading, error, getPurchasedItems } = usePurchasedItems();
    const [ purchasedItems, setPurchasedItems] = useState<PurchaseItem[]>([]);
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

    if (!telegramSubscriptions || telegramSubscriptions.length === 0) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <p className="text-gray-600">No purchased items found</p>
            </div>
        );
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
                <h1 className="text-2xl pb-10 font-bold px-12 text-[#1B3155]">Purchased</h1>
                <table className="w-full text-left">
                    <thead className="border-gray-300 h-20 text-[#1B3155]">
                        <tr className="border-t border-gray-200">
                            <th className="w-1/12 px-8">#</th>
                            <th className="w-2/12">Item Name</th>
                            <th className="w-1/12">Type</th>
                            <th className="w-1/12">Status</th>
                            <th className="w-1/12">Amount (INR)</th>
                            <th className="w-1/12">Purchase Date</th>
                            <th className="w-1/12">Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchasedItems.map((item, index) => (
                            <PurchasedItemRow key={item.id} item={item} index={index} />
                        ))}    
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PurchasedItemRow = ({ item, index }: { item: PurchaseItem, index: number }) => {
    const isSub = "planName" in item;
    const navigate = useNavigate(); 
    const handleRowClick = () => {
        if (isSub) {
            console.log("Telegram Plan");
        }else{
            navigate(`/purchased-digital-products/${item.id}`);
        }
    };
    return (
        <tr 
            onClick={handleRowClick}
            className="border-t border-gray-200 h-20 hover:bg-gray-50 hover:cursor-pointer"
        >
            <td className="px-8">{index + 1}</td>
            <td>{isSub ? item.planName : item.product.title /* or a name prop */}</td>
            <td>
                <span className="bg-[#E7F3FE] text-[#158DF7] text-xs font-semibold rounded-full px-2 py-1">{isSub ? "TELEGRAM_PLAN" : "DIGITAL_PRODUCT"}</span>
            </td>
            <td>
                <div className={`border w-fit px-2 flex items-center gap-2 py-1 rounded-full`}><div className={`${item.status === "ACTIVE" ? "bg-green-500": "bg-red-500"} w-2 h-2 rounded-full`}></div><span className="text-xs">{item.status === "ACTIVE" ? "Active" : "Inactive"}</span></div>
            </td>
            <td>{isSub ? item.planPrice : item.price}</td>
            <td>{new Date(
          isSub ? item.createdAt : item.purchaseDate
        ).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</td>
            <td>{isSub
          ? new Date(item.expiryDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })
          : "–"}</td>
        </tr>
    );
};

export default PurchasedItemsTable;
