import { IoIosAdd } from "react-icons/io"
import { useState } from "react";
import { DigitalProduct } from "../../store/useDigitalProductStore";
import { useDigitalProduct } from "../../hooks/useDigitalProduct";

interface GalleryProps {
  currentProduct: DigitalProduct;
}

const Gallery = ({ currentProduct }: GalleryProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const { deleteGalleryImage } = useDigitalProduct();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Use gallery images directly from currentProduct
  const galleryImages = currentProduct.galleryImages;
  
  const handleDeleteImage = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteGalleryImage(id);
    } catch (err) {
      console.error("Failed to delete gallery image:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Gallery</h1>
      </div>
      <div>
        <button 
          onClick={() => setShowDialog(true)}
          className="text-zinc-500 w-1/3 flex items-center gap-2 border border-dashed border-zinc-500 rounded-full pl-2 pr-4 py-1"
        >
          <IoIosAdd size={20} /> Add Image
        </button>
      </div>
      
      {galleryImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="relative group">
              <img 
                src={image.imageUrl} 
                alt={image.imageName || "Gallery image"} 
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={isDeleting === image.id}
                  className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  {isDeleting === image.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Gallery