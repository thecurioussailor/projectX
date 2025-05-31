import { useState } from "react";
import Testimonials from "./Testimonials";
import Gallery from "./Gallery";
import Faq from "./Faq";
import { DigitalProduct } from "../../store/useDigitalProductStore";
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { FaSpinner } from "react-icons/fa";
import CoverImage from "./CoverImage";
const BasicInformation = ({ currentProduct }: { currentProduct: DigitalProduct }) => {
    const { isLoading, updateProduct } = useDigitalProduct();
    const [formData, setFormData] = useState({
        title: currentProduct?.title || "",
        description: currentProduct?.description || "",
        category: currentProduct?.category || "",
        priceType: currentProduct?.priceType || "FIXED",
        price: currentProduct?.price || "",
        hasDiscount: currentProduct?.hasDiscount || false,
        discountedPrice: currentProduct?.discountedPrice || currentProduct?.price || "",
    }); 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateProduct(currentProduct.id, formData);
    }
  return (
    <div className="md:p-4 w-full">
        <div className="flex flex-col gap-4 pb-8">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 w-full"> 
                        <div className="w-full md:w-1/2 flex flex-col gap-1">
                            <label htmlFor="title">Title</label>
                            <input 
                                className="w-full border border-gray-300 rounded-md p-2"
                                type="text" 
                                id="title" 
                                name="title" 
                                value={formData?.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div className="relative flex flex-col gap-1 w-full md:w-1/2">
                            <label htmlFor="category">Category</label>
                            <div className="relative">
                                <select 
                                    id="category" 
                                    name="category"
                                    value={formData?.category}
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
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>  
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea 
                            className="w-full border border-gray-300 rounded-md p-2 outline-none focus-within:ring-purple-500 focus-within:ring-2"
                            id="description" 
                            name="description" 
                            value={formData?.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-1/2 flex flex-col">
                        <label htmlFor="priceType">Price Type</label>
                        <div className="relative">
                            <select 
                                id="priceType" 
                                name="priceType" 
                                value={formData?.priceType}
                                className="appearance-none w-full px-4 py-2 pr-10 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
                                onChange={(e) => setFormData({...formData, priceType: e.target.value as "FIXED" | "FLEXIBLE"})}
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
                            className="w-full border border-gray-300 rounded-md p-2"
                            type="number" 
                            id="price" 
                            name="price" 
                            value={formData?.price}
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
                                value={formData?.discountedPrice}
                                onChange={(e) => setFormData({...formData, hasDiscount: true, discountedPrice: e.target.value})}
                            />
                        </div>
                    )}
                </div>
                <button 
                    type="submit" 
                    className="bg-[#7F37D8] mt-4 text-white px-4 py-2 rounded-md"
                    disabled={isLoading}
                >
                    {isLoading ? <span className="flex items-center gap-2"><FaSpinner size={20} className="animate-spin"/> Saving...</span> : "Save"}
                </button>
            </form>
            <div className="flex flex-col gap-4">
                <CoverImage productId={currentProduct.id}/>
                <Testimonials currentProduct={currentProduct}/>
                <Gallery productId={currentProduct.id}/>
                <Faq currentProduct={currentProduct} productId={currentProduct.id}/>
            </div>
        </div>
    </div>
  )
}

export default BasicInformation