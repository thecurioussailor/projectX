import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDigitalProductStore, DigitalProduct } from "../../store/useDigitalProductStore";
import LoadingSpinner from "../ui/LoadingSpinner";
import { FiUpload, FiX } from "react-icons/fi";

interface DigitalProductFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'FIXED' | 'FLEXIBLE';
  hasDiscount: boolean;
  discountedPrice?: number;
  ctaButtonText: string;
  status: 'ACTIVE' | 'INACTIVE';
  isLimitedQuantityEnabled: boolean;
  quantity?: number;
  coverImage?: string;
  themeColor?: string;
}

const initialFormData: DigitalProductFormData = {
  title: "",
  description: "",
  category: "",
  price: 0,
  priceType: 'FIXED',
  hasDiscount: false,
  ctaButtonText: "Buy Now",
  status: 'ACTIVE',
  isLimitedQuantityEnabled: false,
};

const DigitalProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    currentProduct, 
    isLoading, 
    error, 
    createProduct, 
    updateProduct, 
    fetchProductById 
  } = useDigitalProductStore();
  
  const [formData, setFormData] = useState<DigitalProductFormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  useEffect(() => {
    if (currentProduct) {
      setFormData({
        title: currentProduct.title,
        description: currentProduct.description || "",
        category: currentProduct.category || "",
        price: currentProduct.price,
        priceType: currentProduct.priceType || 'FIXED',
        hasDiscount: currentProduct.hasDiscount,
        discountedPrice: currentProduct.discountedPrice,
        ctaButtonText: currentProduct.ctaButtonText || "Buy Now",
        status: currentProduct.status,
        isLimitedQuantityEnabled: currentProduct.isLimitedQuantityEnabled,
        quantity: currentProduct.quantity,
        coverImage: currentProduct.coverImage,
        themeColor: currentProduct.themeColor,
      });
      setImagePreview(currentProduct.coverImage || null);
    }
  }, [currentProduct]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // TODO: Implement actual image upload to server
        setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate('/digital-products');
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? 'Edit Product' : 'Create New Product'}
      </h1>

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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
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
              />
            </div>
          )}
        </div>

        {/* Media */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Media</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, coverImage: undefined }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500">
                  <FiUpload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme Color
            </label>
            <input
              type="color"
              name="themeColor"
              value={formData.themeColor || "#6B46C1"}
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
            {id ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DigitalProductForm; 