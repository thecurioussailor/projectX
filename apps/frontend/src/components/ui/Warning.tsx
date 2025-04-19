import { IoMdClose } from "react-icons/io"
import { IoAlertCircleOutline } from "react-icons/io5"

const Warning = ({ title, message, onCancel }: { title: string, message: string, onCancel: () => void }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50">
        <div className="flex flex-col gap-2 bg-white p-8 items-center rounded-3xl border border-gray-200">
            <div className="flex justify-end w-full pb-4">
                <button className="text-[#7F37D8]" onClick={onCancel}><IoMdClose size={20} /></button>
            </div>
            <div className="flex justify-center items-center text-[#7F37D8]">
                <IoAlertCircleOutline size={100} />
            </div>
            <p className="text-2xl font-bold text-[#7F37D8]">{title}</p>
            <p className="text-gray-500">{message}</p>
        </div>
    </div>
  )
}

export default Warning