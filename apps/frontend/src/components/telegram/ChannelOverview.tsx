import { useEffect } from "react";

import { useTelegram } from "../../hooks/useTelegram";
import CreatePlanForm from "../telegram/CreatePlanForm";

const ChannelOverview = ({ channelId }: { channelId: string }) => {
    const { fetchChannelById, currentChannel } = useTelegram();
    useEffect(() => {
        if(channelId) {
            fetchChannelById(channelId);
        }
    }, [channelId, fetchChannelById]);
  return (
    <div className="flex justify-between gap-4 w-full bg-white rounded-[3rem] overflow-clip shadow-lg shadow-purple-100">
            <div className="flex flex-col gap-4 w-full">
                    <div className="relative ml-8 mt-8">
                        <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
                        <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
                        <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
                        <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
                        <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
                        <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
                    </div>
                <div className="flex flex-col gap-2 text-2xl pb-10 font-bold px-12 text-[#1B3155] border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <h1>{currentChannel?.channelName}</h1>
                        <div className={`border w-fit px-2 flex items-center gap-2 py-1 rounded-full`}><div className={`${currentChannel?.status === "ACTIVE" ? "bg-green-500": "bg-red-500"} w-2 h-2 rounded-full`}></div><span className="text-xs">{currentChannel?.status === "ACTIVE" ? "Active" : "Inactive"}</span></div>
                    </div>
                    <p className="text-sm text-gray-500">{currentChannel?.channelDescription}</p>
                </div>
                <div className="flex flex-col gap-2 p-10" >
                    {currentChannel && <CreatePlanForm channel={currentChannel!} onPlanCreated={() => {}} />}
                </div>
            </div>
        </div>
  )
}

export default ChannelOverview