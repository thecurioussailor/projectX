import { useEffect } from "react";
import { usePurchasedItems } from "../../hooks/usePurchasedItems";
import { TelegramSubscription } from "../../store/useTelegramStore";
import LoadingSpinner from "../ui/LoadingSpinner";
import Error from "../ui/Error";
const PurchasedItemsTable = () => {
    const { telegramSubscriptions, isLoading, error, getPurchasedItems } = usePurchasedItems();

    useEffect(() => {
        getPurchasedItems();
    }, [getPurchasedItems]);  
    
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
                            <th className="w-2/12">Plan Name</th>
                            <th className="w-1/12">Status</th>
                            <th className="w-1/12">Price (INR)</th>
                            <th className="w-1/12">Duration</th>
                            <th className="w-1/12">Expiry Date</th>
                            <th className="w-1/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {telegramSubscriptions.map((subscription, index) => (
                            <PurchasedItemRow key={subscription.id} subscription={subscription} index={index} />
                        ))}    
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PurchasedItemRow = ({ subscription, index }: { subscription: TelegramSubscription, index: number }) => {

    return (
        <tr className="border-t border-gray-200 h-20">
            <td className="px-8">{index + 1}</td>
            <td>{subscription.planName}</td>
            <td>
                <span className={`px-2 py-1 rounded-full text-sm ${
                    subscription.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {subscription.status}
                </span>
            </td>
            <td>{subscription.planPrice}</td>
            <td>{subscription.planDuration} days</td>
            <td>{new Date(subscription.expiryDate).toLocaleDateString()}</td>
            <td>
                lkjs
            </td>
        </tr>
    );
};

export default PurchasedItemsTable;
