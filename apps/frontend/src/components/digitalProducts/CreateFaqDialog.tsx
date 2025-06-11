import { IoCloseOutline } from "react-icons/io5"
import { useState } from "react"
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { useToast } from "../ui/Toast";
const CreateFaqDialog = ({ productId, onClose }: { productId: string, onClose: () => void }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const { createFaq } = useDigitalProduct();
  const {showToast} = useToast();
  const handleCreate = async () => {
    try {
      await createFaq(productId, { question, answer });
      onClose();
      showToast('FAQ created successfully', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create FAQ', 'error');
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
      <div className="flex flex-col gap-4 w-full md:w-1/2 bg-white rounded-3xl shadow-lg">
        <div className="flex justify-between py-8 border-b px-8 border-zinc-200 items-center w-full">
          <h1 className="text-2xl">Create FAQ</h1>
            <button onClick={onClose}>
              <IoCloseOutline size={30}/>
            </button>
        </div>
        <div className="flex flex-col gap-4 px-8 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="question">Question</label>
            <input 
              type="text" 
              id="question" 
              className="border border-zinc-200 rounded-md px-4 py-2" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="answer">Answer</label>
            <input 
              type="text" 
              id="answer" 
              className="border border-zinc-200 rounded-md px-4 py-2" 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <button 
            onClick={handleCreate}
            className="bg-[#7F37D8] w-1/3 flex items-center gap-2 justify-center text-white px-4 py-2 rounded-full"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateFaqDialog