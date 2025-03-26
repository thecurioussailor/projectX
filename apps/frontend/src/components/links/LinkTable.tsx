import { FaTrash } from "react-icons/fa"
import { GoCopy } from "react-icons/go"
import { useLink } from "../../hooks/useLink";
import { useState, useEffect } from "react";

const LinkTable = () => {
    const { links, fetchLinks, isLoading } = useLink();
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        
        // Reset the "Copied" state after 2 seconds
        setTimeout(() => {
          setCopied(null);
        }, 1000);
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    return (
        <div className="flex justify-between gap-4 bg-white rounded-3xl">
            <div className="flex flex-col gap-4 w-full">
                <h1 className="text-xl py-10 font-semibold px-8">Your Links</h1>
                {/* tabular view */}
                {links.length === 0 ? (
                    <p className="text-gray-500">You haven't created any shortened links yet.</p>
                ) : (
                    <table className="w-full text-left">
                        <thead className="border-gray-300 h-20">
                            <tr className="border-t border-gray-200">
                                <th className="w-1/12 px-8">#</th>
                                <th className="w-2/12">Original URL</th>
                                <th className="w-1/12">Status</th>
                                <th className="w-1/12">Clicks</th>
                                <th className="w-1/12">Created At</th>
                                <th className="w-1/12">Short Link</th>
                                <th className="w-1/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link, index) => (
                                <tr key={link.id} className="border-t border-gray-200 h-20">
                                    <td className="px-8">{index + 1}</td>
                                    <td>{link.originalUrl}</td>
                                    <td>Active</td>
                                    <td>{link.clicks}</td>
                                    <td>{new Date(link.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short'})}</td>
                                    <td>
                                        <button 
                                            className="relative flex items-center gap-2 hover:text-[#7F37D8]"
                                            onClick={() => copyToClipboard(link.shortUrl, link.id)}
                                        >
                                            <span>{link.shortUrl.split('/').pop()}</span>
                                            <span className="px-4"><GoCopy size={20}/></span>
                                            {copied === link.id && <span className="absolute -top-4 -right-2 text-xs">Copied!</span>}
                                        </button>
                                    </td>
                                    <td className="text-[#7F37D8] pl-5">
                                        <FaTrash size={20}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LinkTable;