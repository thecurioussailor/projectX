import { IoCloseOutline } from "react-icons/io5"
import { useLink } from "../../hooks/useLink";
import { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";

const UrlShortner = ({setOpen}: {setOpen: (open: boolean) => void}) => {
    
    const { createLink, isLoading, error } = useLink();
    const { showToast } = useToast();
    const [url, setUrl] = useState("");
    const [customShortId, setCustomShortId] = useState("");



    useEffect(() => {
        if (error) {
            showToast(error, 'error');
        }   
    }, [error, showToast]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!url) {
            showToast('Please enter a URL to shorten', 'error');
            return;
        }
        
        try {
            const result = await createLink(url, customShortId);
            if (result) {
                showToast('URL shortened successfully!', 'success');
                setUrl("");
                setCustomShortId("");
                setOpen(false);
            }
        } catch {
            showToast('Failed to shorten URL. Please try again.', 'error');
        }
    }
    return (
    <div className="fixed flex justify-center z-50 items-center inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 w-full h-full px-4">
        <div className=" bg-white w-full md:w-2/3 lg:w-1/2 h-auto rounded-3xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex justify-between items-center gap-4 py-10 px-8 border-b border-gray-200">
                <span>Create Short Link</span>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpen(false)}><IoCloseOutline size={30}/></button>
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4 px-8 pb-8">
            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-4">
                    Paste your long URL
                </label>
                <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                className="w-full p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                required
                />
            </div>
            <div>
                <label htmlFor="customShortId" className="block text-sm font-medium text-gray-700 mb-4">
                    Custom Short ID
                </label>
                <div className="flex items-center gap-2">
                    <p className="text-gray-500 p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent">https://wvv.one/</p>
                    <input
                        type="text"
                        id="customShortId"
                        value={customShortId}
                        onChange={(e) => setCustomShortId(e.target.value)}
                        placeholder="Enter a custom short ID"
                        className="w-full p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className={`bg-[#7F37D8] text-white py-3 px-6 rounded-3xl w-40 mt-6 hover:bg-[#6C2EB9] transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
                {isLoading ? 'Shortening...' : 'Shorten URL'}
            </button>
            </form>
        </div>
    </div>
  )
}

export default UrlShortner