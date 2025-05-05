import { IoIosAdd } from "react-icons/io"
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { useState, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
interface GalleryImage {
  id: string;
  productId: string;
  imageUrl: string;
  imageOrder: number;
  imageName: string;
  createdAt: string;
}

const Gallery = ({ productId }: { productId: string }) => {
  const { uploadGallery, getGalleryImage } = useDigitalProduct();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);  
  const [error, setError] = useState<string | null>(null);


  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
      await uploadGallery(productId, file);

      const updatedImages = await getGalleryImage(productId);
        if (updatedImages) {
          setGalleryImages(updatedImages.map((image) => ({
            id: image.id,
            productId: image.productId,
            imageUrl: image.imageUrl,
            imageOrder: image.imageOrder || 0,
            imageName: image.imageName || '',
            createdAt: image.createdAt || ''
          })));
        }
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err instanceof Error ? err.message : 'Failed to upload gallery image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  useEffect(() => {
    const fetchGalleryImages = async () => {
      const images = await getGalleryImage(productId);
      if (images) {
        setGalleryImages(images.map((image) => ({
          id: image.id,
          productId: image.productId,
          imageUrl: image.imageUrl,
          imageOrder: image.imageOrder || 0,
          imageName: image.imageName || '',
          createdAt: image.createdAt || ''
        })));
      }
    };
    fetchGalleryImages();
  }, [getGalleryImage, productId]);

  return (
    <div className="flex flex-col gap-4 border rounded-3xl">
        <div className="flex items-center gap-4 border-b py-8 px-8">
            <h1 className="text-2xl font-semibold text-[#7F37D8]">Gallery</h1>
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="flex items-center gap-4 px-6 pb-4">
            <input 
              ref={fileInputRef} 
              type="file" 
              id="fileInput" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => handleFileChange(e)} />
            <button 
                onClick={triggerFileInput}
                className="text-zinc-500 flex items-center gap-2 border border-dashed border-zinc-500 rounded-full pl-2 pr-4 py-1"
            >
              {isUploading ? (
            <>
              <FaSpinner className="animate-spin" size={20} /> Uploading...
            </>
          ) : (
            <>
              <IoIosAdd size={20} /> Upload Gallery Image
                </>
              )}

            </button>
        </div>
        <div className="flex flex-wrap gap-4 px-6 pb-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="flex items-center gap-4">
              <img src={image.imageUrl} alt={image.imageName} className="object-cover w-40" />
            </div>
          ))}
        </div>
    </div>
  )
}

export default Gallery