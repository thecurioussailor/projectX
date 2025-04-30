import { IoCloseOutline } from "react-icons/io5"
import { useTelegram } from "../../hooks/useTelegram";
import SendTelegramCode from "./SendTelegramCode";
import VerifyTelegramCode from "./VerifyTelegramCode";
import CreateChannelForm from "./CreateChannelForm";
import CreatePlanForm from "./CreatePlanForm";
import { useEffect, useState } from "react";
import { TelegramChannel } from "../../store/useTelegramStore";

// Define Plan interface
interface Plan {
    name: string;
    price: number;
    duration: number;
}

interface CreateChannelDialogProps {
    setOpen: (open: boolean) => void;
    onChannelCreated?: () => void;
}

const CreateChannelDialog = ({ setOpen, onChannelCreated }: CreateChannelDialogProps) => {
    const { accounts, getAccounts, fetchChannels, publishChannel } = useTelegram();
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [step, setStep] = useState<"select" | "phone" | "code" | "create" | "plan">("select");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [newlyCreatedChannel, setNewlyCreatedChannel] = useState<TelegramChannel | null>(null);

    useEffect(() => {
        getAccounts();
    }, [getAccounts]);

    const handleChannelCreated = (channel: TelegramChannel) => {
        setNewlyCreatedChannel(channel);
        setStep("plan");
    };

    const handleAddPlan = (plan: Plan) => {
        // The useTelegram hook already handles adding plans to the store
        console.log("Plan created:", plan);
    };

    const handlePublish = () => {
        // Refresh the channels list after publishing
        if (newlyCreatedChannel) {
            publishChannel(newlyCreatedChannel.id);
            fetchChannels();
        }
        // Notify parent if callback exists
        if (onChannelCreated) {
            onChannelCreated();
        }
        // Close the dialog
        setOpen(false);
    };

    return (
        <div className="fixed flex justify-center items-center inset-0 bg-black/50 w-full h-full z-50 px-4">
            <div className="bg-white w-full md:w-2/3 lg:w-1/2 h-3/4 rounded-3xl shadow-md flex flex-col">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Create Channel</h2>
                    <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpen(false)}>
                        <IoCloseOutline size={30}/>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col gap-4 w-full">
                        {step === "select" && (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-medium">Select Telegram Account</h3>
                                {accounts.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {accounts.map((account) => (
                                            <div 
                                                key={account.id} 
                                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                            >
                                                <input 
                                                    type="radio" 
                                                    name="account" 
                                                    value={account.telegramNumber} 
                                                    checked={selectedAccount === account.telegramNumber}
                                                    onChange={() => {
                                                        setSelectedAccount(account.telegramNumber);
                                                        setStep("create");
                                                    }}
                                                    className="cursor-pointer"
                                                />
                                                <label className="cursor-pointer">{account.telegramNumber}</label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No existing accounts found.</p>
                                )}
                                <button 
                                    onClick={() => setStep("phone")}
                                    className="bg-[#7F37D8] text-white mt-4 py-2 px-4 w-40 rounded-3xl hover:bg-[#6C2EB9] transition-colors"
                                >
                                    Add New Account
                                </button>
                            </div>
                        )}

                        {step === "phone" && (
                            <SendTelegramCode 
                                onPhoneNumberChange={(phoneNumber: string) => setPhoneNumber(phoneNumber)} 
                                onSuccess={() => setStep("code")}
                            />
                        )}

                        {step === "code" && (
                            <VerifyTelegramCode
                                phoneNumber={phoneNumber}
                                onSuccess={() => setStep("create")}
                            />
                        )}

                        {step === "create" && (
                            <CreateChannelForm 
                                onSuccess={handleChannelCreated}
                                onError={() => setStep("phone")}
                                phoneNumber={phoneNumber}
                                selectedAccount={selectedAccount}
                            />
                        )}

                        {step === "plan" && newlyCreatedChannel && (
                            <CreatePlanForm 
                                onPlanCreated={handleAddPlan}
                                channel={newlyCreatedChannel}
                            />
                        )}
                    </div>
                </div>
                
                {step === "plan" && (
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex justify-end">
                            <button 
                                onClick={handlePublish}
                                className="bg-[#7F37D8] text-white py-2 px-6 rounded-3xl hover:bg-[#6C2EB9] transition-colors"
                            >
                                Publish Channel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateChannelDialog;