import { useState, useRef, useCallback, useEffect } from "react";
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import LoadingSpinner from "../ui/LoadingSpinner";
import { IoCloudUpload, IoDocumentText, IoImage, IoMusicalNote, IoFilm, IoDocument, IoCloseCircle } from "react-icons/io5";
import { DigitalProduct } from "../../store/useDigitalProductStore";

const UploadProduct = ({ currentProduct }: { currentProduct: DigitalProduct }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const { uploadFile, deleteFile, fetchProductById } = useDigitalProduct();
    const dropRef = useRef<HTMLDivElement>(null);
    // const [currentFiles, setCurrentFiles] = useState<DigitalProduct[]>([]);

    useEffect(() => {
        console.log("Uploading product with ID:", currentProduct.id);
    }, [currentProduct.id]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            setSuccess(false);
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            setIsDragging(true);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setError(null);
            setSuccess(false);
        }
    }, []);

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first");
            return;
        }

        try {
            setIsUploading(true);
            setError(null);
            setSuccess(false);
            
            // Simulate progress
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 300);
            
            // Use the uploadFile helper from the hook which handles both steps
            await uploadFile(currentProduct.id, file);
            
            clearInterval(interval);
            setUploadProgress(100);
            setSuccess(true);
            setFile(null);
            
            await fetchProductById(currentProduct.id);
           
            // Reset progress after 1 second
            setTimeout(() => {
                setUploadProgress(0);
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteFile = async (fileId: string) => {
        try {
            await deleteFile(currentProduct.id, fileId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete file");
        }
    };

    const getFileIcon = (fileType: string) => {
        switch(fileType) {
            case 'PDF': return <IoDocumentText size={24} className="text-red-500" />;
            case 'IMAGE': return <IoImage size={24} className="text-green-500" />;
            case 'VIDEO': return <IoFilm size={24} className="text-blue-500" />;
            case 'AUDIO': return <IoMusicalNote size={24} className="text-yellow-500" />;
            default: return <IoDocument size={24} className="text-gray-500" />;
        }
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Upload Files</h2>
            
            <div 
                ref={dropRef}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragging 
                        ? "border-[#7F37D8] bg-purple-50" 
                        : "border-gray-300 hover:border-[#7F37D8] hover:bg-purple-50"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3"
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                >
                    <IoCloudUpload size={50} className={isDragging ? "text-[#7F37D8]" : "text-gray-400"} />
                    <span className={`text-lg ${isDragging ? "text-[#7F37D8]" : "text-gray-600"}`}>
                        {file ? file.name : "Drag & drop files here or click to browse"}
                    </span>
                    <span className="text-sm text-gray-500 max-w-md mx-auto">
                        Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, MP4, MP3 (max 100MB)
                    </span>
                </label>
            </div>

            {file && (
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="px-6 py-2.5 bg-[#7F37D8] text-white rounded-full hover:bg-[#6C2EB9] disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                        {isUploading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                Uploading...
                            </>
                        ) : (
                            "Upload File"
                        )}
                    </button>
                    <button
                        onClick={() => setFile(null)}
                        className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-[#7F37D8] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {uploadProgress < 100 ? `Uploading: ${uploadProgress}%` : 'Upload complete!'}
                    </p>
                </div>
            )}

            {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="text-green-500 text-sm bg-green-50 p-3 rounded-lg">
                    File uploaded successfully!
                </div>
            )}

            {/* Existing Files Section */}
            {currentProduct.files.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Uploaded Files</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentProduct.files.map(file => (
                            <div key={file.id} className="bg-white rounded-lg shadow p-4 flex items-start gap-3 group relative">
                                {getFileIcon(file.fileType)}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{file.fileName}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.fileSize / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteFile(file.id)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Delete file"
                                >
                                    <IoCloseCircle size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadProduct;