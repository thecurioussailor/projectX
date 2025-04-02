import { IoIosAdd } from "react-icons/io"
import { useState } from "react"
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { DigitalProduct } from "../../store/useDigitalProductStore";
import CreateFaqDialog from "./CreateFaqDialog";

interface FaqProps {
  productId: string;
  currentProduct: DigitalProduct;
}

const Faq = ({ productId, currentProduct }: FaqProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const { deleteFaq } = useDigitalProduct();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Use faqs directly from the currentProduct
  const faqs = currentProduct.faqs;

  const handleDeleteFaq = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteFaq(id);
    } catch (err) {
      console.error("Failed to delete FAQ:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">FAQ</h1>
        </div>
        <div>
            <button 
                onClick={() => setShowDialog(true)}
                className="text-zinc-500 w-1/3 flex items-center gap-2 border border-dashed border-zinc-500 rounded-full pl-2 pr-4 py-1"
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
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-semibold text-lg mb-2">{faq.question}</h2>
              <p className="text-gray-600">{faq.answer}</p>
              <button 
                onClick={() => handleDeleteFaq(faq.id)}
                disabled={isDeleting === faq.id}
                className="mt-4 text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                {isDeleting === faq.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Faq