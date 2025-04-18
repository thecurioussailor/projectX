import { FaTrash } from "react-icons/fa"
import { GoCheck, GoCopy } from "react-icons/go"
import { useLink } from "../../hooks/useLink";
import { useState, useEffect } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import Error from "../ui/Error";
import { IoAlertCircleOutline } from "react-icons/io5";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const LinkTable = () => {
    const { links, fetchLinks, isLoading, deleteLink, error } = useLink();
    const [copied, setCopied] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const copyToClipboard = (id: string) => {
        const shareableLink = `${BACKEND_URL}/api/v1/links/${id}`;
        
        navigator.clipboard.writeText(shareableLink);
        setCopied(id);
        
        // Reset the "Copied" state after 2 seconds
        setTimeout(() => {
          setCopied(null);
        }, 1000);
    };

    if (isLoading) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <Error error={error} />
        )
    }

    if(links.length === 0) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <p className="text-gray-500">You haven't created any shortened links yet.</p>
            </div>
        )
    }
    return (
        <div className="flex justify-between gap-4 bg-white rounded-[3rem] w-full overflow-clip shadow-lg shadow-purple-100">
            <div className="flex flex-col gap-4 w-full">
                <div className="relative ml-8 mt-8">
                    <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
                    <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
                    <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
                    <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
                    <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
                    <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
                </div>
                <h1 className="text-2xl pb-10 font-bold px-12 text-[#1B3155]">Your Links</h1>
                {/* tabular view */}
                {links.length === 0 ? (
                    <div className="w-full h-[calc(100vh-450px)] flex justify-center items-center">
                        <p className="text-gray-500">You haven't created any shortened links yet.</p>
                    </div>
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
                                            onClick={() => copyToClipboard(link.shortId)}
                                        >
                                            <span>{link.shortId}</span>
                                            <button 
                                                onClick={() => copyToClipboard(link.shortId)}
                                                className="px-4 py-2 rounded-r-3xl w-1/3">{copied === link.shortId ? <GoCheck size={20} /> : <GoCopy size={20} />}</button>
                                            </button>
                                    </td>
                                    <td className="text-[#7F37D8] pl-5">
                                        <button onClick={() => setOpen(true)}>
                                            <FaTrash size={20}/>
                                        </button>
                                        {open && (
                                            <Alert onCancel={() => setOpen(false)} onDelete={() => {
                                                deleteLink(link.id);
                                                setOpen(false);
                                            }}/>
                                        )}
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

const Alert = ({ onCancel, onDelete }: { onCancel: () => void, onDelete: () => void }) => {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-black/50">
          <div className="flex flex-col gap-2 bg-white p-8 items-center rounded-3xl border border-gray-200">
              <div className="flex justify-center items-center">
                  <IoAlertCircleOutline size={100} />
              </div>
              <p className="text-2xl font-bold">Are you sure?</p>
              <p className="text-gray-500">Once deleted, you will not be able to recover this link or any related data!</p>
              <div className="flex gap-4 justify-between mt-6">
                  <button className="border border-gray-300 text-gray-500 px-8 py-2 rounded-3xl" onClick={onCancel}>Cancel</button>
                  <button className="bg-[#7F37D8] text-white px-8 py-2 rounded-3xl" onClick={onDelete}>Delete</button>
              </div>
          </div>
      </div>
    )
  }
