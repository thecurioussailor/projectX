import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { usePlatformPlan } from "../../hooks/usePlatformPlan";
import { FaSpinner } from "react-icons/fa";
interface FormData {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number | null;
  transactionFeePercentage: number;
  isCustom: boolean;
  isDefault: boolean;
  isActive: boolean;
}

const CreatePlatformPlanForm = ({setOpen}: {setOpen: (open: boolean) => void}) => {
  const { createPlan, isLoading, error } = usePlatformPlan();
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    monthlyPrice: 0,
    transactionFeePercentage: 0,
    annualPrice: null,
    isCustom: false,
    isDefault: false,
    isActive: true,
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? null : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (formData.monthlyPrice < 0) {
      errors.monthlyPrice = "Price cannot be negative";
    }
    
    if (formData.transactionFeePercentage < 0 || formData.transactionFeePercentage > 100) {
      errors.transactionFeePercentage = "Transaction fee must be between 0 and 100";
    }
    
    if (formData.annualPrice !== null && formData.annualPrice < 0) {
      errors.annualPrice = "Annual price cannot be negative";
    }
    
    setFormErrors(errors);
    
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await createPlan(formData);
      setSuccessMessage("Plan created successfully!");
      setTimeout(() => {
        setOpen(false);
      }, 2000);
        
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  return (
    <div className="fixed flex justify-center items-center inset-0 bg-black/50 w-full h-full overflow-hidden z-50">
      <div className="bg-white w-3/4 md:w-2/3 lg:w-1/2 h-auto max-h-[85vh] rounded-3xl shadow-md flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Platform Plan</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpen(false)}>
            <IoCloseOutline size={30}/>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col col-span-2 gap-2">
                <label htmlFor="name" className="font-medium">Plan Name*</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter plan name" 
                  className="w-full p-2 rounded-md border border-gray-300" 
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="description" className="font-medium">Description</label>
                <textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter plan description" 
                  rows={3}
                  className="w-full p-2 rounded-md border border-gray-300" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="price" className="font-medium">Monthly Price*</label>
                <input 
                  type="number" 
                  id="monthlyPrice" 
                  name="monthlyPrice"
                  value={formData.monthlyPrice}
                  onChange={handleChange}
                  placeholder="Enter monthly price" 
                  className="w-full p-2 rounded-md border border-gray-300" 
                />
                {formErrors.monthlyPrice && <p className="text-red-500 text-sm">{formErrors.monthlyPrice}</p>}
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="annualPrice" className="font-medium">Annual Price</label>
                <input 
                  type="number" 
                  id="annualPrice" 
                  name="annualPrice"
                  value={formData.annualPrice === null ? '' : formData.annualPrice}
                  onChange={handleChange}
                  placeholder="Enter annual price" 
                  className="w-full p-2 rounded-md border border-gray-300" 
                />
                {formErrors.annualPrice && <p className="text-red-500 text-sm">{formErrors.annualPrice}</p>}
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="transactionFeePercentage" className="font-medium">Transaction Fee (%)*</label>
                <input 
                  type="number" 
                  id="transactionFeePercentage" 
                  name="transactionFeePercentage"
                  value={formData.transactionFeePercentage}
                  onChange={handleChange}
                  placeholder="Enter transaction fee percentage" 
                  className="w-full p-2 rounded-md border border-gray-300" 
                />
                {formErrors.transactionFeePercentage && <p className="text-red-500 text-sm">{formErrors.transactionFeePercentage}</p>}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium mb-3">Plan Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isDefault" 
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="w-4 h-4" 
                  />
                  <label htmlFor="isDefault">Default Plan</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isActive" 
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4" 
                  />
                  <label htmlFor="isActive">Active</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isCustom" 
                    name="isCustom"
                    checked={formData.isCustom}
                    onChange={handleChange}
                    className="w-4 h-4" 
                  />
                  <label htmlFor="isCustom">Custom Plan</label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Plan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePlatformPlanForm;