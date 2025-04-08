import { IoIosAdd } from "react-icons/io"
import { useState } from "react"
import { DigitalProduct } from "../../store/useDigitalProductStore";
import CreateFaqDialog from "./CreateFaqDialog";

interface FaqProps {
  productId: string;
  currentProduct: DigitalProduct;
}

const Faq = ({ productId, currentProduct }: FaqProps) => {
  const [showDialog, setShowDialog] = useState(false);

  // Use faqs directly from the currentProduct
  const faqs = currentProduct.faqs;

  

  return (
    <div className="flex flex-col gap-4 border rounded-3xl">
        <div className="flex items-center gap-4 border-b py-8 px-8">
            <h1 className="text-2xl font-semibold text-purple-600">FAQ</h1>
        </div>
        
        <div className="flex items-center gap-4 px-6 pt-4">
            <button 
                onClick={() => setShowDialog(true)}
                className="text-zinc-500 flex items-center gap-2 border border-dashed border-zinc-500 rounded-full pl-2 pr-4 py-1"
            >
                <IoIosAdd size={20} /> Add FAQ
            </button>
            {showDialog && (
                <CreateFaqDialog 
                  productId={productId} 
                  onClose={() => setShowDialog(false)} 
                />
            )}
        </div>
        <div className="grid grid-cols-1 gap--2 px-4 py-4">
          {faqs.map((faq) => (
            <Accordion 
              key={faq.id} 
              title={faq.question} 
              content={faq.answer} 
            />
          ))}
        </div>
    </div>
  )
}

export default Faq

const Accordion = ({title, content}: {title: string, content: string}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-4">
      <h2 className="bg-[#7F37D8] rounded-t-3xl text-sm text-white font-semibold px-8 py-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          type="button" 
          className="flex items-center justify-between w-full">
          {title}
        </button>
      </h2>
      {isOpen && (
        <div className="py-6 border-b border-x border-zinc-200 text-sm px-8 rounded-b-3xl transition-all duration-300 ease-in-out bg-white">
          {content}
        </div>
      )}
    </div>
  )
}