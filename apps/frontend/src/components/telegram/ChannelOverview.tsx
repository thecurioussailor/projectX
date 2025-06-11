import { useEffect, useState } from "react";

import { useTelegram } from "../../hooks/useTelegram";
import CreatePlanForm from "../telegram/CreatePlanForm";
import RichTextEditor from "./RichTextEditor";
import { IoClose } from "react-icons/io5";
import { RiImageAddLine } from "react-icons/ri";
import { useToast } from "../ui/Toast";

const ChannelOverview = ({ channelId }: { channelId: string }) => {
    const { fetchChannelById, currentChannel, updateChannel, updateChannelContact } = useTelegram();
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [richDescription, setRichDescription] = useState('');
    const [contactEmail, setContactEmail] = useState(currentChannel?.contactEmail || '');
    const [contactPhone, setContactPhone] = useState(currentChannel?.contactPhone || '');
    const [isSavingContact, setIsSavingContact] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {showToast} = useToast();
    useEffect(() => {
        if(channelId) {
            fetchChannelById(channelId);
        }
    }, [channelId, fetchChannelById]);

    useEffect(() => {
        if (currentChannel?.richDescription) {
            setRichDescription(currentChannel.richDescription);
        }
    }, [currentChannel]);

    const handleSaveDescription = async () => {
        if (!currentChannel) return;
        
        setIsUpdating(true);
        try {
            await updateChannel(currentChannel.id, {
                richDescription: richDescription
            });
            showToast('Description updated successfully', 'success');
            setIsEditingDescription(false);
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to update description', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSaveContact = async () => {
        if (!currentChannel) return;
        setIsSavingContact(true);
        try {
            await updateChannelContact(currentChannel.id, { contactEmail: contactEmail, contactPhone: contactPhone });
            showToast('Contact updated successfully', 'success');
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to update contact', 'error');
        } finally {
            setIsSavingContact(false);
        }
    }

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
                    <div className="relative">
                        <button 
                            className="bg-[#7E37D8] absolute top-0 right-10 text-white px-4 py-2 rounded-full"
                            onClick={() => {
                                setIsDialogOpen(true);
                            }}
                        >
                            <RiImageAddLine />
                        </button>
                        {isDialogOpen && currentChannel?.id && <UploadBanner channelId={currentChannel.id} onClose={() => setIsDialogOpen(false)} />}
                        <img src={currentChannel?.bannerUrl} alt="Banner" className="w-full h-48 object-contain" />
                    </div>
                    <div className="flex flex-col gap-4 px-12">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#1B3155]">Channel Description</h3>
                        {!isEditingDescription && (
                            <button
                                onClick={() => setIsEditingDescription(true)}
                                className="bg-[#7E37D8] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#6B2FB5] transition-colors"
                            >
                                Edit Description
                            </button>
                        )}
                    </div>
                    {/* Description Section */}
                    {isEditingDescription ? (
                        <div className="space-y-4">
                            <RichTextEditor
                                value={richDescription}
                                onChange={setRichDescription}
                                placeholder="Write a detailed description for your channel..."
                                height="300px"
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => {
                                        setIsEditingDescription(false);
                                        setRichDescription(currentChannel?.richDescription || '');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveDescription}
                                    className="bg-[#7E37D8] text-white px-4 py-2 rounded-lg hover:bg-[#6B2FB5] transition-colors disabled:opacity-50"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Saving...' : 'Save Description'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
                            {currentChannel?.richDescription ? (
                                <RichTextEditor
                                    value={currentChannel.richDescription}
                                    onChange={() => {}} // No-op since it's read-only
                                    readOnly={true}
                                    height="auto"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-32 text-gray-500">
                                    <p>No description added yet. Click "Edit Description" to add one.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2 p-10">
                    <h3 className="text-lg font-semibold text-[#1B3155]">Channel Contact</h3>
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            id="contact-email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full lg:w-1/2 p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                            required
                        />
                        <input
                            type="text"
                            id="contact-phone"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="Phone"
                            className="w-full lg:w-1/2 p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                        />
                    </div>
                    <button 
                        className="bg-[#7E37D8] text-white px-4 py-2 w-32 mt-4 rounded-lg hover:bg-[#6B2FB5] transition-colors disabled:opacity-50" 
                        onClick={handleSaveContact}
                        disabled={isSavingContact}
                    >{isSavingContact ? 'Saving...' : 'Save Contact'}</button>
                </div>
                {/* Plan Section */}
                <div className="flex flex-col gap-2 p-10" >
                    {currentChannel && <CreatePlanForm channel={currentChannel!} onPlanCreated={() => {}} />}
                </div>
            </div>
        </div>
  )
}

export default ChannelOverview

const UploadBanner = ({ channelId, onClose }: { channelId: string, onClose: () => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { uploadBanner } = useTelegram();
    const {showToast} = useToast();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        
        try {
            await uploadBanner(channelId, file);
            showToast('Banner uploaded successfully', 'success');
            onClose();
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to upload banner', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between pb-4">
                    <h1 className="text-2xl font-bold text-[#1B3155]">Upload Banner</h1>
                    <button onClick={onClose}>
                        <IoClose size={30}/>
                    </button>
                </div>
                <input type="file" onChange={handleFileChange} />
                <button 
                    onClick={handleUpload} 
                    className="bg-[#7E37D8] text-white px-4 py-2 rounded-lg hover:bg-[#6B2FB5] transition-colors disabled:opacity-50" 
                    disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
            </div>
        </div>
    );
};
