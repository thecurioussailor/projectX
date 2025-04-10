import { useEffect, useState } from "react";
import { usePurchasedItems } from "../../hooks/usePurchasedItems";
import LoadingSpinner from "../ui/LoadingSpinner";
import Error from "../ui/Error";
import { PurchaseItem } from "../../store/usePurchasedItemsStore";
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
        <div className="flex justify-between gap-4 bg-white rounded-3xl w-full">
            <div className="flex flex-col gap-4 w-full">
                <h1 className="text-xl py-10 font-semibold px-8">Purchased</h1>
                <table className="w-full text-left">
                    <thead className="border-gray-300 h-20">
                        <tr className="border-t border-gray-200">
                            <th className="w-1/12 px-8">#</th>
                            <th className="w-2/12">Item Name</th>
                            <th className="w-1/12">Type</th>
                            <th className="w-1/12">Status</th>
                            <th className="w-1/12">Price (INR)</th>
                            <th className="w-1/12">Purchase Date</th>
                            <th className="w-1/12">Expiry Date</th>
                            <th className="w-1/12">Actions</th>
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
    return (
        <tr className="border-t border-gray-200 h-20">
            <td className="px-8">{index + 1}</td>
            <td>{isSub ? item.planName : item.product.title /* or a name prop */}</td>
            <td>
                {isSub ? "Subscription" : "Digital"}
            </td>
            <td>
                <div className={`border w-fit px-2 flex items-center gap-2 py-1 rounded-full`}><div className={`${item.status === "ACTIVE" ? "bg-green-500": "bg-red-500"} w-2 h-2 rounded-full`}></div><span className="text-xs">{item.status === "ACTIVE" ? "Active" : "Inactive"}</span></div>
            </td>
            <td>{isSub ? item.planPrice : item.price}</td>
            <td>{new Date(
          isSub ? item.createdAt : item.purchaseDate
        ).toLocaleDateString()}</td>
            <td>{isSub
          ? new Date(item.expiryDate).toLocaleDateString()
          : "–"}</td>
            <td>
                {isSub ? (
                    <button
                    className="border rounded-full px-4 py-2 text-xs hover:bg-purple-600 hover:text-white"
                >
                    Show Subscription
                </button>
                ): (
                    <button
                        className="border rounded-full px-4 py-2 text-xs hover:bg-purple-600 hover:text-white"
                    >
                        Show Digital
                    </button>
                )}
            </td>
        </tr>
    );
};

export default PurchasedItemsTable;
