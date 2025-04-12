import { useParams, useNavigate } from "react-router-dom";
import { usePurchasedItems } from "../hooks/usePurchasedItems";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { FaArrowLeft, FaDownload, FaFilePdf, FaFileImage, FaFileAudio, FaFileVideo, FaFile } from "react-icons/fa";
import { DigitalFile } from "../store/usePurchasedItemsStore";

const PurchasedDigitalProducts = () => {
    const { digitalPurchases, isLoading, error, getDigitalProductFiles } = usePurchasedItems();
    const [files, setFiles] = useState<DigitalFile[]>([]);
    const [productTitle, setProductTitle] = useState('Digital Product');
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (id) {
            getDigitalProductFiles(id);
        }
    }, [id, getDigitalProductFiles]);

    useEffect(() => {
        if (digitalPurchases && digitalPurchases.length > 0) {
            // Set the product title
            setProductTitle(digitalPurchases[0]?.product?.title || 'Digital Product');
            
            // Get the files from the first digital purchase
            if (digitalPurchases[0]?.files && Array.isArray(digitalPurchases[0].files)) {
                setFiles(digitalPurchases[0].files);
            }
        }
    }, [digitalPurchases]);

    const getFileIcon = (fileType: string) => {
        if (fileType === 'PDF' || fileType.toLowerCase().includes('pdf')) return <FaFilePdf size={24} />;
        if (fileType === 'IMAGE' || fileType.toLowerCase().includes('image')) return <FaFileImage size={24} />;
        if (fileType === 'AUDIO' || fileType.toLowerCase().includes('audio')) return <FaFileAudio size={24} />;
        if (fileType === 'VIDEO' || fileType.toLowerCase().includes('video')) return <FaFileVideo size={24} />;
        return <FaFile size={24} />;
    };

    const getFileName = (url: string) => {
        try {
            // Extract filename from URL or use a default name
            const urlParts = new URL(url).pathname.split('/');
            let fileName = urlParts[urlParts.length - 1];
            
            // Remove any query parameters
            fileName = fileName.split('?')[0];
            
            // URL decode the filename
            fileName = decodeURIComponent(fileName);
            
            return fileName || 'Download File';
        } catch (e) {
            return 'Download File';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4 items-center justify-center h-[calc(100vh-200px)]">
                <p className="text-red-500">Error: {error}</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    <FaArrowLeft /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    <FaArrowLeft /> Back
                </button>
                <h1 className="text-2xl font-bold text-[#1B3155]">{productTitle}</h1>
            </div>
            
            <div className="bg-white rounded-[3rem] p-8 shadow-lg shadow-purple-100">
                <h2 className="text-xl font-semibold mb-6 text-[#1B3155]">Product Files</h2>
                
                {files.length === 0 ? (
                    <p className="text-gray-500">No files available for this product.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {files.map((file) => (
                            <div key={file.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-2">
                                    {getFileIcon(file.type)}
                                    <span className="font-medium truncate">{getFileName(file.presignedUrl)}</span>
                                </div>
                                
                                {file.type === 'VIDEO' && (
                                    <div className="mt-3 mb-3">
                                        <video 
                                            controls 
                                            className="w-full rounded-lg"
                                            poster="/video-thumbnail.png"
                                        >
                                            <source src={file.presignedUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xs text-gray-500 uppercase">{file.type}</span>
                                    <a 
                                        href={file.presignedUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-[#7E37D8] text-white rounded-lg hover:bg-[#6a2cb8] text-sm"
                                        download
                                    >
                                        <FaDownload /> Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchasedDigitalProducts;