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
                    <h1 className="text-2xl pb-10 font-bold px-12 text-[#1B3155]">Subscribers</h1>
                {/* tabular view */}
                <div className="overflow-x-auto lg:overflow-x-hidden">
                    <table className="w-full text-left min-w-max lg:min-w-full">
                        <thead className=" border-gray-300 h-20">
                            <tr className="border-t border-gray-200">
                                <th className="lg:w-1/12 px-8">#</th>
                                <th className="lg:w-2/12 px-4">Name</th>
                                <th className="lg:w-1/12 px-4">Status</th>
                                <th className="lg:w-1/12 px-4">Plan</th>
                                <th className="lg:w-1/12 px-4">Amount</th>
                                <th className="lg:w-1/12 px-4">Start Date</th>
                                <th className="lg:w-1/12 px-4">Expiry Date</th>
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
            <td className="px-4">{subscriber.user.username}</td>
            <td className="px-4">{subscriber.status}</td>
            <td className="px-4">{subscriber.plan.name}</td>
            <td className="px-4">{subscriber.plan.price}</td>
            <td className="px-4">{new Date(subscriber.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            <td className="px-4">{new Date(subscriber.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>  
    )
}