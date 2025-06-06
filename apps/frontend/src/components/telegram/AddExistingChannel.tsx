import { useState, useEffect } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import { TelegramChannel, TelegramChannelData } from "../../store/useTelegramStore";

interface AddExistingChannelProps {
    onSuccess: (channel: TelegramChannel) => void;
    onError: () => void;
    selectedAccount: string | null;
    phoneNumber: string;
}

const AddExistingChannel = ({ onSuccess, onError, selectedAccount, phoneNumber }: AddExistingChannelProps) => {
    const [availableChannels, setAvailableChannels] = useState<TelegramChannelData[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<TelegramChannelData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingChannels, setIsLoadingChannels] = useState(false);
    const { createExistingTelegramChannel, getTelegramChannels, error } = useTelegram();

    const telegramNumber = selectedAccount || phoneNumber;

    useEffect(() => {
        if (telegramNumber) {
            fetchTelegramChannels();
        }
    }, [telegramNumber]);

    const fetchTelegramChannels = async () => {
        setIsLoadingChannels(true);
        try {
            const response = await getTelegramChannels(telegramNumber);
            setAvailableChannels(response.channels || []);
        } catch (error) {
            console.error("Error fetching Telegram channels:", error);
        } finally {
            setIsLoadingChannels(false);
        }
    };

    const handleAddExistingChannel = async () => {
        if (!selectedChannel) return;

        setIsLoading(true);
        try {
            const newChannel = await createExistingTelegramChannel({
                telegramChannelId: selectedChannel.telegramChannelId,
                telegramNumber: telegramNumber,
                channelName: selectedChannel.channelName,
                channelDescription: selectedChannel.channelDescription,
                username: selectedChannel.username
            });

            if (newChannel) {
                onSuccess(newChannel);
            } else {
                throw new Error("Channel was not added properly");
            }
        } catch (error) {
            console.error("Error adding existing channel:", error);
            onError();
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingChannels) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading your Telegram channels...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {selectedAccount && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Adding channel for account: {selectedAccount}</p>
                </div>
            )}

            <h3 className="text-lg font-medium">Select a Channel to Import</h3>
            
            {availableChannels.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                    No channels found for this Telegram account. Make sure you have admin rights to at least one channel.
                </div>
            ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {availableChannels.map((channel) => (
                        <div
                            key={channel.telegramChannelId}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedChannel?.telegramChannelId === channel.telegramChannelId
                                    ? "border-[#7F37D8] bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedChannel(channel)}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="channel"
                                    checked={selectedChannel?.telegramChannelId === channel.telegramChannelId}
                                    onChange={() => setSelectedChannel(channel)}
                                    className="text-[#7F37D8]"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium">{channel.channelName}</h4>
                                    <p className="text-sm text-gray-600 truncate">
                                        {channel.channelDescription || "No description"}
                                    </p>
                                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                        <span>{channel.participantsCount} members</span>
                                        <span>{channel.channelType}</span>
                                        {channel.isCreator && <span className="text-green-600">Creator</span>}
                                        {channel.username && <span>@{channel.username}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-start gap-2">
                <button
                    onClick={handleAddExistingChannel}
                    disabled={isLoading || !selectedChannel}
                    className="bg-[#7F37D8] text-white py-2 px-4 rounded-3xl hover:bg-[#6C2EB9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Adding..." : "Add Channel"}
                </button>
                <button
                    onClick={fetchTelegramChannels}
                    disabled={isLoadingChannels}
                    className="border border-[#7F37D8] text-[#7F37D8] py-2 px-4 rounded-3xl hover:bg-purple-50 transition-colors"
                >
                    Refresh
                </button>
            </div>
        </div>
    );
};

export default AddExistingChannel;