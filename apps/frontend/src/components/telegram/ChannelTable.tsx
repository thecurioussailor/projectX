import { GoCheck, GoCopy } from "react-icons/go"
import { IoShareSocialOutline } from "react-icons/io5"
import { useTelegram } from "../../hooks/useTelegram";
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import { TelegramChannel } from "../../store/useTelegramStore";

const PUBLIC_APP_URL = import.meta.env.VITE_PUBLIC_APP_URL;
console.log("PUBLIC_APP_URL", PUBLIC_APP_URL);
const ChannelTable = () => {
    const { channels, fetchChannels, isLoading } = useTelegram();
    const [hasFetched, setHasFetched] = useState(false);
    
    useEffect(() => {
        // Only fetch channels if we haven't fetched them yet
        if (!hasFetched && channels.length === 0) {
            fetchChannels();
            setHasFetched(true);
        }
    }, [fetchChannels, hasFetched, channels.length]);

    if (isLoading && channels.length === 0) {
        return <div className="flex justify-center items-center">
            <LoadingSpinner />
        </div>
    }

    return (
        <div className="flex justify-between gap-4 bg-white rounded-3xl">
            <div className="flex flex-col gap-4 w-full">
                <h1 className="text-xl py-10 font-semibold px-8">Channels</h1>
                {/* tabular view */}
                <table className="w-full text-left">
                    <thead className=" border-gray-300 h-20">
                        <tr className="border-t border-gray-200">
                            <th className="w-1/12 px-8">#</th>
                            <th className="w-2/12">Name</th>
                            <th className="w-1/12">Status</th>
                            <th className="w-1/12">Plans</th>
                            <th className="w-1/12">Revenue</th>
                            <th className="w-1/12">Sales</th>
                            <th className="w-1/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {channels.map((channel, index) => (
                            <ChannelTableRow key={channel.id} channel={channel} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ChannelTable;

const ChannelTableRow = ({ channel, index }: { channel: TelegramChannel, index: number }) => {
    const [copied, setCopied] = useState(false);
    const handleShare = (channelId: string) => {
        const shareableLink = `${PUBLIC_APP_URL}/c/${channelId}`;
        console.log(shareableLink);
        window.open(shareableLink, '_blank');
    };
    const handleCopy = (channelId: string) => {
        const shareableLink = `${PUBLIC_APP_URL}/c/${channelId}`;
        console.log(shareableLink);
        navigator.clipboard.writeText(shareableLink).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        });
    };  
    
    return (
        <tr className="border-t border-gray-200 h-20">
            <td className="px-8">{index + 1}</td>
            <td>{channel.channelName}</td>
            <td>{channel.status}</td>
            <td>{channel.telegramPlans?.length}</td>
            <td>{channel.telegramPlans?.reduce((acc, plan) => acc + plan.subscriptions?.length, 0)}</td>
            <td>{channel.telegramPlans?.reduce((acc, plan) => acc + plan.subscriptions?.reduce((acc, subscription) => acc + Number(subscription.planPrice), 0), 0)}</td>
            <td>
                <div className="flex items-center bg-[#7F37D8] rounded-3xl text-white w-40">
                    <button 
                        onClick={() => handleShare(channel.id)}
                        className="border-r flex items-center gap-2 border-white px-4 py-2 w-2/3"><IoShareSocialOutline size={20}/> Share</button>
                    <button 
                    onClick={() => handleCopy(channel.id)}
                        className="px-4 py-2 rounded-r-3xl w-1/3">{copied ? <GoCheck size={20} /> : <GoCopy size={20} />}</button>
                </div>
            </td>
        </tr>  
    )
}