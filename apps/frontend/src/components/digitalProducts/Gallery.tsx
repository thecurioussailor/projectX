import { IoIosAdd } from "react-icons/io"
import { DigitalProduct } from "../../store/useDigitalProductStore";

interface GalleryProps {
  currentProduct: DigitalProduct;
}

const Gallery = ({ currentProduct }: GalleryProps) => {
  
  // Use gallery images directly from currentProduct
  const galleryImages = currentProduct.galleryImages;
  

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Gallery</h1>
      </div>
      <div>
        <button 
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
                  className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  Delete
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