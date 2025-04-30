import { IoIosAdd } from "react-icons/io"
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { useState, useEffect } from "react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        setIsUploading(true);
        await uploadGallery(productId, selectedFile);
        setIsUploading(false);
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
        setSelectedFile(null);
      } catch (error) {
        console.error("Error uploading gallery image:", error);
      }
    }
  }

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
        <div className="flex items-center gap-4 px-6 pb-4">
            <input type="file" id="fileInput" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            <button 
                onClick={() => document.getElementById("fileInput")?.click()}
                className="text-zinc-500 flex items-center gap-2 border border-dashed border-zinc-500 rounded-full pl-2 pr-4 py-1"
            >
                <IoIosAdd size={20} /> Add Image
            </button>
        </div>
        <div className="flex items-center gap-4 px-6 pb-4">
            <button 
                onClick={handleUpload}
                className="bg-[#7F37D8] text-white rounded-full pl-4 pr-4 py-1"
            >
              {isUploading ? <FaSpinner className="animate-spin" /> : "Upload"}
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