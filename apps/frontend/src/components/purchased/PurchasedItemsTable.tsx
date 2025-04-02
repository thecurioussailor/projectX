import { useEffect } from "react";
import { usePurchasedItems } from "../../hooks/usePurchasedItems";
import { TelegramSubscription } from "../../store/useTelegramStore";
import LoadingSpinner from "../ui/LoadingSpinner";

const PurchasedItemsTable = () => {
    const { telegramSubscriptions, isLoading, error, getPurchasedItems } = usePurchasedItems();

    useEffect(() => {
        getPurchasedItems();
    }, [getPurchasedItems]);  
    
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="bg-red-50 p-6 rounded-lg max-w-lg text-center">
                <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!telegramSubscriptions || telegramSubscriptions.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Purchased Items</h2>
                <p className="text-gray-600">You haven't purchased any subscriptions yet.</p>
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
                            <th className="w-1/12">Price</th>
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
            <td>${subscription.planPrice}</td>
            <td>{subscription.planDuration} days</td>
            <td>{new Date(subscription.expiryDate).toLocaleDateString()}</td>
            <td>
                lkjs
            </td>
        </tr>
    );
};

export default PurchasedItemsTable;
