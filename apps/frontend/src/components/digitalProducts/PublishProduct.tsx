import { DigitalProduct } from "../../store/useDigitalProductStore";
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/Toast";

const PublishProduct = ({ currentProduct }: { currentProduct: DigitalProduct }) => {
  const { updateProduct, publishProduct, unpublishProduct } = useDigitalProduct();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const navigate = useNavigate();
  const {showToast} = useToast();
  const [formData, setFormData] = useState<{
    ctaButtonText: string;
    isLimitedQuantityEnabled: boolean;
    quantity: number;
  }>({
    ctaButtonText: currentProduct?.ctaButtonText || "",
    isLimitedQuantityEnabled: currentProduct?.isLimitedQuantityEnabled || false,
    quantity: currentProduct?.quantity || 0,    
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await updateProduct(currentProduct.id, formData);
    showToast('Product updated successfully', 'success');
    setIsLoading(false);
  }
  return (
    <div className="flex flex-col gap-6 w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
            <label htmlFor="ctaButtonText">Button Text</label>
            <input 
              className="w-fit border px-4 py-2 outline-none"
              name="ctaButtonText"
              type="text" 
              id="ctaButtonText" 
              value={formData?.ctaButtonText}
              placeholder="Buy Now"
              onChange={(e) => setFormData({...formData, ctaButtonText: e.target.value})}
            />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-4">
            <label htmlFor="isLimitedQuantityEnabled">Limit Number of Purchases</label>
            <input 
              className="border border-gray-300 rounded-md p-2 outline-none focus-within:ring-[#7F37D8] focus-within:ring-2"
              name="isLimitedQuantityEnabled"
              type="checkbox" 
              id="isLimitedQuantityEnabled" 
              checked={formData?.isLimitedQuantityEnabled}
              onChange={(e) => setFormData({...formData, isLimitedQuantityEnabled: e.target.checked})}
            />
          </div>
          {formData?.isLimitedQuantityEnabled && (
            <div className="flex items-center gap-4">
              <label htmlFor="isLimitedQuantityEnabled">Quantity</label>
              <input 
                className="border border-gray-300 rounded-md p-2 outline-none focus-within:ring-[#7F37D8] focus-within:ring-2"
                name="quantity"
                type="number" 
                id="quantity" 
                value={formData?.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              />
            </div>
          )}
        </div>
        <button type="submit" className="bg-[#7F37D8] mt-4 text-white px-4 py-2 rounded-3xl flex items-center gap-2">
          {isLoading ? <span className="flex items-center gap-2"><FaSpinner size={20} className="animate-spin"/> Saving...</span> : "Save"}
        </button>
      </form>
      <div className="flex flex-col gap-2">
      {currentProduct?.status === "ACTIVE" ? (
            <button 
              onClick={async () => {
                setIsUnpublishing(true);
                await unpublishProduct(currentProduct.id)
                setIsUnpublishing(false);
                showToast('Product unpublished successfully', 'success');
              }}
              className=" font-semibold text-white flex justify-center lg:w-fit items-center gap-2 bg-[#7F37D8] border-white py-2 px-4 hover:bg-[#6C2EB9] transition-colors rounded-3xl"
          >
            {isUnpublishing ? <span className="flex items-center gap-2"><FaSpinner size={20} className="animate-spin"/> Unpublishing...</span> : "Unpublish"}
          </button>
          ) : (
            <button 
              className="font-semibold flex justify-center lg:w-fit items-center gap-2 bg-[#7F37D8] text-white py-2 pl-2 pr-4 hover:bg-[#6C2EB9] transition-colors rounded-3xl"
              onClick={async () => {
                
                  setIsPublishing(true);
                  await publishProduct(currentProduct.id);
                  setIsPublishing(false);
                  showToast('Product published successfully', 'success');
                  navigate(`/digital-products`);
              }}
            >
              {isPublishing ? <span className="flex items-center gap-2"><FaSpinner size={20} className="animate-spin"/> Publishing...</span> : "Publish"}
            </button>
          )}
           <button 
            className="font-semibold flex items-center justify-center lg:w-fit gap-2 bg-[#7F37D8] text-white py-2 pl-2 pr-4 hover:bg-[#6C2EB9] transition-colors rounded-3xl"
            onClick={() => {
              navigate(`/d/${currentProduct?.id}`);
            }}
           >
            View Product
           </button>
        </div>
    </div>
  )
}

export default PublishProduct