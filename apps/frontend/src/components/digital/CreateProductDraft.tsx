import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDigitalProductStore } from "../../store/useDigitalProductStore";
import LoadingSpinner from "../ui/LoadingSpinner";

interface DraftFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'FIXED' | 'FLEXIBLE';
  hasDiscount: boolean;
  discountedPrice?: number;
  ctaButtonText: string;
  isLimitedQuantityEnabled: boolean;
  quantity?: number;
  themeColor: string;
}

const initialFormData: DraftFormData = {
  title: "",
  description: "",
  category: "",
  price: 0,
  priceType: 'FIXED',
  hasDiscount: false,
  ctaButtonText: "Buy Now",
  isLimitedQuantityEnabled: false,
  themeColor: "#6B46C1"
};

const CreateProductDraft = () => {
  const navigate = useNavigate();
  const { createProduct, isLoading, error } = useDigitalProductStore();
  const [formData, setFormData] = useState<DraftFormData>(initialFormData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) 
          : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const product = await createProduct(formData);
      navigate(`/digital-products/${product.id}/edit`);
    } catch (error) {
      console.error('Failed to create product draft:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Product</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product category"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Pricing</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Type
              </label>
              <select
                name="priceType"
                value={formData.priceType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="FIXED">Fixed Price</option>
                <option value="FLEXIBLE">Flexible Price</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter price"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hasDiscount"
              checked={formData.hasDiscount}
              onChange={handleInputChange}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Enable Discount
            </label>
          </div>

          {formData.hasDiscount && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Price
              </label>
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice || ""}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter discounted price"
              />
            </div>
          )}
        </div>

        {/* Product Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Product Settings</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call-to-Action Button Text
            </label>
            <input
              type="text"
              name="ctaButtonText"
              value={formData.ctaButtonText}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter CTA button text"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isLimitedQuantityEnabled"
              checked={formData.isLimitedQuantityEnabled}
              onChange={handleInputChange}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Enable Limited Quantity
            </label>
          </div>

          {formData.isLimitedQuantityEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ""}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter available quantity"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme Color
            </label>
            <input
              type="color"
              name="themeColor"
              value={formData.themeColor}
              onChange={handleInputChange}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/digital-products')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Create Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductDraft; 