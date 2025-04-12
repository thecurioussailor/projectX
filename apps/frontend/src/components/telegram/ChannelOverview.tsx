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
    <div className="flex justify-between gap-4 bg-white rounded-3xl w-full">
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2 px-8 py-10 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl  font-semibold ">{currentChannel?.channelName}</h1>
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