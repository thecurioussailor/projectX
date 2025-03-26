import { GoCopy } from "react-icons/go"
import { IoShareSocialOutline } from "react-icons/io5"
import { useTelegram } from "../../hooks/useTelegram";
import { useEffect } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";

const ChannelTable = () => {
    const { channels, fetchChannels, isLoading } = useTelegram();

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);

    if (isLoading) {
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
                  <tr key={index} className="border-t border-gray-200 h-20">
                    <td className="px-8">{index + 1}</td>
                    <td>{channel.channelName}</td>
                    <td>{channel.botAdded ? "Active" : "Inactive"}</td>
                    <td>{channel.channelId}</td>
                    <td>{channel.channelId}</td>
                  <td>10</td>
                  <td>
                    <div className="flex items-center bg-[#7F37D8] rounded-3xl text-white w-40">
                    <button className="border-r flex items-center gap-2 border-white px-4 py-2 w-2/3"><IoShareSocialOutline size={20}/> Share</button>
                      <button className="px-4 py-2 rounded-r-3xl w-1/3"><GoCopy size={20}/></button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  )
}

export default ChannelTable