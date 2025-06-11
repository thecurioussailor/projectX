import { useState } from 'react';
import { useDigitalProduct } from '../../hooks/useDigitalProduct';
import { DigitalProduct } from '../../store/useDigitalProductStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import { FaSpinner } from 'react-icons/fa';
const DigitalProductForm = ({setShowForm}: {setShowForm: (show: boolean) => void}) => {
  const {createProduct} = useDigitalProduct();
  const [loading, setLoading] = useState(false);
  const {showToast} = useToast();
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
    setLoading(true);
    const product = await createProduct(formData as Partial<DigitalProduct>);
    setLoading(false);
    showToast('Product created successfully', 'success');
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
            <div className="relative w-full flex flex-col items-left gap-2">
                <label htmlFor="category">Category</label>
                <div className="relative">
                    <select 
                        id="category" 
                        name="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="appearance-none w-full px-4 py-2 pr-10 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
                    >
                        <option value="Education">Education</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Health">Health</option>
                        <option value="Business">Business</option>
                        <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-1/2 flex flex-col">
                    <label htmlFor="priceType">Price Type</label>
                    <div className="relative">
                        <select 
                            id="priceType" 
                            name="priceType" 
                            value={formData.priceType}
                            className="appearance-none w-full px-4 py-2 pr-10 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
                            onChange={(e) => setFormData({...formData, priceType: e.target.value})}
                        >
                            <option value="FIXED">Fixed</option>
                            <option value="FLEXIBLE">Flexible</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="price">{formData.priceType === "FIXED" ? "Price" : "Minimum Price"}</label>    
                    <input 
                        className="w-full border border-gray-300 rounded-md p-2 outline-none focus-within:ring-[#7F37D8] focus-within:ring-2"
                        type="number" 
                        id="price" 
                        name="price" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        min={1}
                    />
                </div>
                {formData.priceType === "FIXED" && (
                    <div className="w-full">
                        <label htmlFor="discountedPrice">Discounted Price</label>
                        <input 
                            className="w-full border border-gray-300 rounded-md p-2 outline-none focus-within:ring-[#7F37D8] focus-within:ring-2"
                            type="number" 
                            id="discountedPrice" 
                            name="discountedPrice" 
                            value={formData.discountedPrice}
                            onChange={(e) => setFormData({...formData, hasDiscount: true, discountedPrice: e.target.value})}
                            min={1}
                            max={formData.price}
                        />
                    </div>
                )}
            </div>
            <button 
                type="submit" 
                className="bg-[#7F37D8] text-white rounded-3xl w-40 p-2"
                disabled={loading}
            >
                {loading ? <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Creating...</span> : "Create Product"}
            </button>
        </form>
    </div>
  )
}

export default DigitalProductForm