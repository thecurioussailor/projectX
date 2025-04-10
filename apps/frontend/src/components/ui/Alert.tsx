import { IoAlertCircleOutline } from "react-icons/io5"

const Alert = ({ onCancel, onDelete }: { onCancel: () => void, onDelete: () => void }) => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black/50">
        <div className="flex flex-col gap-2 bg-white p-8 items-center rounded-3xl border border-gray-200">
            <div className="flex justify-center items-center">
                <IoAlertCircleOutline size={100} />
            </div>
            <p className="text-2xl font-bold">Are you sure?</p>
            <p className="text-gray-500">Once deleted, you will not be able to recover this link or any related data!</p>
            <div className="flex gap-4 justify-between mt-6">
                <button onClick={onCancel} className="bg-gray-200 text-[#7F37D8] px-4 py-2 rounded-3xl">Cancel</button>
                <button onClick={onDelete} className="bg-[#7F37D8] text-white px-4 py-2 rounded-3xl">Delete</button>
            </div>
        </div>
    </div>
  )
}

export default Alert