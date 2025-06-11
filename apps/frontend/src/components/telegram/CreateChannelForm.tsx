import { useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import { TelegramChannel } from "../../store/useTelegramStore";
import { useToast } from "../ui/Toast";

interface CreateChannelFormProps {
  onSuccess: (channel: TelegramChannel) => void;
  onError: () => void;
  selectedAccount: string | null;
  phoneNumber: string;
}

const CreateChannelForm = ({ onSuccess, onError, selectedAccount, phoneNumber }: CreateChannelFormProps) => {
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const { createChannel, isLoading } = useTelegram();
  const {showToast} = useToast();

  const handleCreateChannel = async () => {
    try {
      const newChannel = await createChannel(channelName, channelDescription, selectedAccount ? selectedAccount : phoneNumber);
      if (newChannel) {
        onSuccess(newChannel);
        showToast('Channel created successfully', 'success');
      } else {
        throw new Error("Channel was not created properly");
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to create channel", 'error');
      onError();
    }
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-left">
      <div className="flex flex-col gap-2 w-full">
        {selectedAccount && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Creating channel for account: {selectedAccount}</p>
          </div>
        )}
        
        <label className="text-sm font-medium text-gray-700 text-left" htmlFor="channel-name">
          Channel Name
        </label>
        <div className="flex flex-row gap-2">
          <input
            type="text"
            id="channel-name"
            value={channelName} 
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter channel name"
            className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
            required
          />
        </div>

        <label className="text-sm font-medium text-gray-700 text-left mt-4" htmlFor="channel-description">
          Channel Description
        </label>
        <div className="flex flex-row gap-2">
          <textarea
            id="channel-description"
            value={channelDescription}
            onChange={(e) => setChannelDescription(e.target.value)}
            placeholder="Enter channel description"
            className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
            rows={4}
            required
          />
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <button
          onClick={handleCreateChannel}
          disabled={isLoading || !channelName || !channelDescription}
          className="bg-[#7F37D8] text-white mt-4 py-2 px-4 w-40 rounded-3xl hover:bg-[#6C2EB9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create Channel"}
        </button>
      </div>
    </div>
  );
};

export default CreateChannelForm; 