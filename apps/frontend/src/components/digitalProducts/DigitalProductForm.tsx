import { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { useDigitalProduct } from '../../hooks/useDigitalProduct';
import { DigitalProduct } from '../../store/useDigitalProductStore';
import { useNavigate } from 'react-router-dom';
const DigitalProductForm = ({setShowForm}: {setShowForm: (show: boolean) => void}) => {
  const {createProduct} = useDigitalProduct();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "EDUCATION",
    priceType: "FIXED",
    price: "",
    hasDiscount: false,
    discountedPrice: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(formData.priceType === "FIXED" && !formData.discountedPrice) {
      return;
    }
    if(formData.priceType === "FLEXIBLE" && !formData.discountedPrice) {
      formData.discountedPrice = formData.price;
    }
    const product = await createProduct(formData as Partial<DigitalProduct>);
    setShowForm(false);
    navigate(`/digital-products/${product.id}/edit`);
  };
  return (
    <div className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label htmlFor="title">Title</label>
                <input 
                    className="w-full border border-gray-300 rounded-md p-2"
                    type="text" 
                    id="title" 
                    name="title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea 
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus-within:ring-purple-500 focus-within:ring-2"
                    id="description" 
                    name="description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>
            <div className="relative w-full flex items-center gap-2">
                <label htmlFor="category">Category</label>
                <select 
                    id="category" 
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 appearance-none outline-none focus-within:ring-purple-500 focus-within:ring-2"
                >
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Health">Health</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                </select>
                <IoIosArrowDown size={20} className="absolute z-50 top-6 right-2 -translate-y-1/2 text-gray-500 focus-within:outline-none" />
            </div>
            <div className="flex items-center gap-4">
                <div className="relative w-1/2 flex flex-col">
                    <label htmlFor="priceType">Price Type</label>
                    <select 
                        id="priceType" 
                        name="priceType" 
                        value={formData.priceType}
                        className="w-full border border-gray-300 rounded-md p-2 outline-none focus-within:ring-[#7F37D8] focus-within:ring-2 appearance-none"
                        onChange={(e) => setFormData({...formData, priceType: e.target.value})}
                    >
                        <option value="FIXED">Fixed</option>
                        <option value="FLEXIBLE">Flexible</option>
                    </select>
                    <IoIosArrowDown size={20} className="absolute z-50 top-12 right-2 -translate-y-1/2 text-gray-500 focus-within:outline-none" />
                </div>
                <div className="w-1/2">
                    <label htmlFor="price">{formData.priceType === "FIXED" ? "Price" : "Minimum Price"}</label>    
                    <input 
                        className="w-full border border-gray-300 rounded-md p-2"
                        type="number" 
                        id="price" 
                        name="price" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                </div>
                {formData.priceType === "FIXED" && (
                    <div>
                        <label htmlFor="discountedPrice">Discounted Price</label>
                        <input 
                            className="w-full border border-gray-300 rounded-md p-2"
                            type="number" 
                            id="discountedPrice" 
                            name="discountedPrice" 
                            value={formData.discountedPrice}
                            onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                        />
                    </div>
                )}
            </div>
            <button type="submit" className="bg-[#7F37D8] text-white rounded-3xl w-40 p-2">Create Product</button>
        </form>
    </div>
  )
}

export default DigitalProductForm