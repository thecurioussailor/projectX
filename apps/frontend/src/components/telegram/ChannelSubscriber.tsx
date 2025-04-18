import { useEffect } from "react";
import { useTelegram } from "../../hooks/useTelegram";

const ChannelSubscriber = ({ channelId }: { channelId: string }) => {
  const { fetchChannelSubscribers, subscribers } = useTelegram();

  useEffect(() => {
    if (channelId) {
      fetchChannelSubscribers(channelId);
    }
  }, [channelId, fetchChannelSubscribers]);

  return (
    <div className="flex justify-between gap-4 bg-white rounded-3xl w-full">
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2 px-8 py-10">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl  font-semibold ">Subscribers</h1>
                    </div>
                </div>
                {/* tabular view */}
                <table className="w-full text-left">
                    <thead className=" border-gray-300 h-20">
                        <tr className="border-t border-gray-200">
                            <th className="w-1/12 px-8">#</th>
                            <th className="w-2/12">Name</th>
                            <th className="w-1/12 pl-3">Status</th>
                            <th className="w-1/12">Plan</th>
                            <th className="w-1/12">Amount</th>
                            <th className="w-1/12">Start Date</th>
                            <th className="w-1/12">Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map((subscriber, index) => (
                            <SubscriberRow key={subscriber.id} subscriber={subscriber} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default ChannelSubscriber

interface Subscriber {
    id: string;
    user: {
        id: string;
        username: string;
        name: string;
        email: string;
        phone: string;
    };
    status: string;
    plan: {
        id: string;
        name: string;
        price: number;
        createdAt: string;
        expiryDate: string;
    };
    createdAt: string;
    expiryDate: string;
}

const SubscriberRow = ({ subscriber, index }: { subscriber: Subscriber, index: number }) => {

    return (
        <tr className="border-t border-gray-200 h-20">
            <td className="px-8">{index + 1}</td>
            <td>{subscriber.user.username}</td>
            <td>{subscriber.status}</td>
            <td>{subscriber.plan.name}</td>
            <td>{subscriber.plan.price}</td>
            <td>{subscriber.createdAt}</td>
            <td>{subscriber.expiryDate}</td>
        </tr>  
    )
}