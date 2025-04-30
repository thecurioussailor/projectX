import { IoCloseOutline } from "react-icons/io5"
import DigitalProductForm from "./DigitalProductForm"
const CreateDigitalProductDraft = ({setOpen}: {setOpen: (open: boolean) => void}) => {
  return (
    <div className="fixed flex justify-center items-center inset-0 bg-black/50 w-full h-full overflow-hidden z-50 px-4">
        <div className="bg-white w-full md:w-2/3 lg:w-1/2 h-auto rounded-3xl shadow-md flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Create Digital Product</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpen(false)}>
                    <IoCloseOutline size={30}/>
                </button>
            </div>
            <div>
                <DigitalProductForm setShowForm={setOpen} />
            </div>
        </div>
    </div>
  )
}

export default CreateDigitalProductDraft