import { useState, useRef, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { FaSpinner } from "react-icons/fa";

interface CoverImageProps {
  productId?: string;
  onUploadSuccess?: (imageUrl: string) => void;
}

const CoverImage = ({ productId, onUploadSuccess }: CoverImageProps) => {
  const { uploadCover, getCoverImage, isLoading } = useDigitalProduct();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState<string | null>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!productId) {
      setError('Product ID is required for uploading.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadCover(productId, file);
      if (imageUrl && onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }
       // Add this: Fetch the updated cover image after successful upload
       const updatedCoverImage = await getCoverImage(productId);
       setCoverImage(updatedCoverImage);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err instanceof Error ? err.message : 'Failed to upload cover image');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchCoverImage = async () => {
      if (productId) {
        const coverImage = await getCoverImage(productId);
        setCoverImage(coverImage);
      }
    };
    fetchCoverImage();
  }, [getCoverImage, productId]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
    <div className="flex flex-col md:flex-row gap-4 border rounded-3xl p-4 w-full">
      <div className="flex flex-col gap-4 md:w-1/2">
        <h1 className="text-xl font-semibold text-purple-600">Cover Image</h1>
        
        {error && (
          <div className="text-red-500 mb-4 p-2 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        <button 
          onClick={triggerFileInput}
          disabled={isUploading || isLoading}
          className="text-zinc-500 flex items-center gap-2 border border-dashed border-zinc-500 rounded-full pl-2 pr-4 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <FaSpinner className="animate-spin" size={20} /> Uploading...
            </>
          ) : (
            <>
              <IoIosAdd size={20} /> Upload Cover Image
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 mt-2">
          Recommended size: 1200 x 630 pixels. Max size: 5MB.
        </p>
      </div>
      <div>
      {coverImage && (
          <div className="w-full relative">
            <img src={coverImage} alt="cover image" className="object-cover w-44"/>
          </div>
        )}
    </div>
    </div>
    </div>
  );
};

export default CoverImage;