import { IoIosAdd } from "react-icons/io"
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { useState } from "react";

const Gallery = ({ productId }: { productId: string }) => {
  const { uploadGallery, } = useDigitalProduct();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (selectedFile) {
      uploadGallery(productId, selectedFile);
    }
  }

  return (
    <div className="flex flex-col gap-4 border rounded-3xl">
        <div className="flex items-center gap-4 border-b py-8 px-8">
            <h1 className="text-2xl font-semibold text-purple-600">Gallery</h1>
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
                className="bg-purple-600 text-white rounded-full pl-4 pr-4 py-1"
            >
                Upload
            </button>
        </div>
    </div>
  )
}

export default Gallery