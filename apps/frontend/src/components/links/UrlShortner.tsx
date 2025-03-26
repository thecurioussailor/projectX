import { IoCloseOutline } from "react-icons/io5"
import { useLink } from "../../hooks/useLink";
import { useState } from "react";

const UrlShortner = ({setOpen}: {setOpen: (open: boolean) => void}) => {
    
    const { createLink, isLoading, error } = useLink();
    const [url, setUrl] = useState("");
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!url) return;
        await createLink(url);
        setUrl("");
        setOpen(false);
    }
    return (
    <div className="fixed flex justify-center z-50 items-center inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 w-full h-full">
        <div className=" bg-white w-1/2 h-auto p-6 rounded-3xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex justify-between items-center gap-2 py-10 px-8 border-b border-gray-200">
                <span>Create Short Link</span>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpen(false)}><IoCloseOutline size={30}/></button>
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
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
            
            {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
            </div>
            )}
        </div>
    </div>
  )
}

export default UrlShortner