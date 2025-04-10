import { GoCheck, GoCopy } from "react-icons/go"
import { IoShareSocialOutline } from "react-icons/io5"
import { useTelegram } from "../../hooks/useTelegram";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import { TelegramChannel } from "../../store/useTelegramStore";
import Warning from "../ui/Warning";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaEdit, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const PUBLIC_APP_URL = import.meta.env.VITE_PUBLIC_APP_URL;

const ChannelTable = () => {
    const { channels, fetchChannels, isLoading } = useTelegram();
    useEffect(() => {
        if (channels.length === 0) {
            fetchChannels();
        }
    }, [fetchChannels, channels.length]);

    if (isLoading && channels.length === 0) {
        return <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
            <LoadingSpinner />
        </div>
    }

    if(channels.length === 0) {
        return <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
            <p className="text-gray-600">No channels found</p>
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
                            <th className="w-1/12 pl-3">Status</th>
                            <th className="w-1/12">Plans</th>
                            <th className="w-1/12">Revenue</th>
                            <th className="w-1/12">Sales</th>
                            <th className="w-2/12">Actions</th>
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
    const [showWarning, setShowWarning] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { unpublishChannel, publishChannel, deleteChannel } = useTelegram();
    const navigate = useNavigate();
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []); 

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
            <td><div className={`border w-fit px-2 flex items-center gap-2 py-1 rounded-full`}><div className={`${channel.status === "ACTIVE" ? "bg-green-500": "bg-red-500"} w-2 h-2 rounded-full`}></div><span className="text-xs">{channel.status === "ACTIVE" ? "Active" : "Inactive"}</span></div></td>
            <td className="pl-4">{channel.telegramPlans?.length}</td>
            <td className="pl-6">{channel.telegramPlans?.reduce((acc, plan) => acc + plan.subscriptions?.length, 0)}</td>
            <td className="pl-3">{channel.telegramPlans?.reduce((acc, plan) => acc + plan.subscriptions?.reduce((acc, subscription) => acc + Number(subscription.planPrice), 0), 0)}</td>
            <td>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#7F37D8] rounded-3xl text-white w-40">
                        <button 
                            onClick={() => {
                                if(channel.status === "ACTIVE") {
                                    handleShare(channel.id);
                                } else {
                                    setShowWarning(true);
                                }
                            }}
                            className="border-r flex items-center gap-2 border-white px-4 py-2 w-2/3"><IoShareSocialOutline size={20}/> Share</button>
                            {showWarning && <Warning title="Channel is inactive" message="Please activate the channel to share it" onCancel={() => setShowWarning(false)} />}
                        <button 
                        onClick={() => {
                            if(channel.status === "ACTIVE") {
                                handleCopy(channel.id);
                            } else {
                                setShowWarning(true);
                            }
                        }}
                            className="px-4 py-2 rounded-r-3xl w-1/3">{copied ? <GoCheck size={20} /> : <GoCopy size={20} />}</button>
                    </div>
                    <div ref={ref} className="relative">
                        <button 

                            onClick={() => setShowMenu(!showMenu)}
                            className="text-[#7F37D8] ml-4 p-2 hover:bg-gray-100 rounded-full"
                        >
                                <HiOutlineDotsVertical />
                        </button>
                        {showMenu && (
                            <div className="relative">
                                <div className="absolute z-10 top-10 -right-12 border border-gray-200 rounded-3xl">
                                    <div className="flex flex-col rounded-3xl bg-white overflow-clip">
                                        <button 
                                            onClick={() => navigate(`/telegram/${channel.id}/edit`)}        
                                            className="px-4 py-2 flex items-center gap-2  hover:bg-purple-600 hover:text-white"><FaEdit size={15}/> Edit</button>
                                        {channel.status === "ACTIVE" ? (
                                            <button onClick={() => unpublishChannel(channel.id)} className="px-4 py-2 flex items-center gap-2  hover:bg-purple-600 hover:text-white"><FaEyeSlash size={15}/> Unpublish</button>
                                        ) : (
                                            <button onClick={() => publishChannel(channel.id)} className="px-4 py-2 flex items-center gap-2  hover:bg-purple-600 hover:text-white"><FaEye size={15}/> Publish</button>
                                        )}
                                        <button onClick={() => deleteChannel(channel.id)} className="px-4 py-2 flex items-center gap-2  hover:bg-purple-600 hover:text-white"><FaTrash size={15}/> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>  
    )
}