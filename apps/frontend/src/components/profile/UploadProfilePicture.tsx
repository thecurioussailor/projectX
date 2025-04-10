import { useRef, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { FaSpinner } from "react-icons/fa";

const UploadProfilePicture = () => {
    const { uploadAndUpdateProfilePicture } = useProfile();
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    }
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Only image files are allowed');
            return;
        }
  
        setIsUploading(true);
        setError(null);

        try {
            await uploadAndUpdateProfilePicture(file);
        } catch (err) {
            console.error("Upload failed:", err);
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }
  
    return (
        <div className="flex flex-col gap-2">
            <label className="font-medium">Profile Picture</label>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
            <button 
                onClick={triggerFileInput} 
                disabled={isUploading}
                className="text-zinc-500 flex items-center gap-2 border border-dashed border-zinc-500 rounded-full pl-2 pr-4 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <>
                        <FaSpinner className="animate-spin" /> Uploading...
                    </>
                ) : (
                    'Upload Profile Picture'
                )}
            </button>
        </div>
    )
}

export default UploadProfilePicture