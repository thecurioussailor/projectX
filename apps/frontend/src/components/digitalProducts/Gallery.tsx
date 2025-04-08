import { IoIosAdd } from "react-icons/io"

const Gallery = () => {
  

  return (
    <div className="flex flex-col gap-4 border rounded-3xl">
        <div className="flex items-center gap-4 border-b py-8 px-8">
            <h1 className="text-2xl font-semibold text-purple-600">Gallery</h1>
        </div>
        <div className="flex items-center gap-4 px-6 pb-4">
            <button 
                className="text-zinc-500 flex items-center gap-2 border border-dashed border-zinc-500 rounded-full pl-2 pr-4 py-1"
            >
                <IoIosAdd size={20} /> Add Image
            </button>
        </div>
    </div>
  )
}

export default Gallery