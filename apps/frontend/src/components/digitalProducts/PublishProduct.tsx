import { DigitalProduct } from "../../store/useDigitalProductStore";
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { useState } from "react";
const PublishProduct = ({ currentProduct }: { currentProduct: DigitalProduct }) => {
  const { updateProduct } = useDigitalProduct();
  const [formData, setFormData] = useState<{
    ctaButtonText: string;
    isLimitedQuantityEnabled: boolean;
    quantity: number;
  }>({
    ctaButtonText: currentProduct?.ctaButtonText || "",
    isLimitedQuantityEnabled: currentProduct?.isLimitedQuantityEnabled || false,
    quantity: currentProduct?.quantity || 0,    
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProduct(currentProduct.id, formData);
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
            <label htmlFor="ctaButtonText">Button Text</label>
            <input 
              className="w-full border border-gray-300 rounded-md p-2 outline-none focus-within:ring-[#7F37D8] focus-within:ring-2"
              name="ctaButtonText"
              type="text" 
              id="ctaButtonText" 
              value={formData?.ctaButtonText}
              onChange={(e) => setFormData({...formData, ctaButtonText: e.target.value})}
            />
        </div>
        <div>
          <div>
            <label htmlFor="isLimitedQuantityEnabled">Limit Number of Purchases</label>
            <input 
              className="w-full border border-gray-300 rounded-md p-2 outline-none focus-within:ring-[#7F37D8] focus-within:ring-2"
              name="isLimitedQuantityEnabled"
              type="checkbox" 
              id="isLimitedQuantityEnabled" 
              checked={formData?.isLimitedQuantityEnabled}
              onChange={(e) => setFormData({...formData, isLimitedQuantityEnabled: e.target.checked})}
            />
          </div>
          {formData?.isLimitedQuantityEnabled && (
            <div>
              <label htmlFor="isLimitedQuantityEnabled">Quantity</label>
              <input 
                className="w-full border border-gray-300 rounded-md p-2 outline-none focus-within:ring-[#7F37D8] focus-within:ring-2"
                name="quantity"
                type="number" 
                id="quantity" 
                value={formData?.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              />
            </div>
          )}
        </div>
        <button type="submit" className="bg-[#7F37D8] mt-4 text-white px-4 py-2 rounded-md">Save</button>
      </form>
    </div>
  )
}

export default PublishProduct