import { useState } from "react";
import ChannelOverview from "../components/telegram/ChannelOverview";
import ChannelSubscriber from "../components/telegram/ChannelSubscriber";
import { useParams } from "react-router-dom";

const EditTelegramChannel = () => {
    const [activeTab, setActiveTab] = useState("Overview");
    const { id } = useParams();
    return (
      <section className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#7F37D8]"> Telegram Channel </h1>
          <div className="flex gap-4">
            <button 
              className={`py-2 px-2 transition-colors ${activeTab === "Overview" ? "border-b-2 border-b-[#7F37D8] text-[#7F37D8] font-semibold" : "border-b-2 border-b-transparent"}`}
              onClick={() => setActiveTab("Overview")}
            >Overview</button>
            <button 
              className={`py-2 px-2 transition-colors ${activeTab === "Subscribers" ? "border-b-2 border-b-[#7F37D8] text-[#7F37D8] font-semibold" : "border-b-2 border-b-transparent"}`}
              onClick={() => setActiveTab("Subscribers")}
            >Subscribers</button>
          </div>
      </div>
      <div className="flex justify-between gap-6 mb-10 w-full">      
          {activeTab === "Overview" && <ChannelOverview channelId={id as string}/>}
          {activeTab === "Subscribers" && <ChannelSubscriber channelId={id as string}/>}
      </div>
  </section>
  )
}

export default EditTelegramChannel