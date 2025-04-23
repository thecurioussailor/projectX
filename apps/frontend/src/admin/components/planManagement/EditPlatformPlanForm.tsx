import { useState } from "react";
import { usePlatformPlan } from "../../hooks/usePlatformPlan";
import { PlatformSubscriptionPlan } from "../../store/usePlatformPlanStore";
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

const EditPlatformPlanForm = ({plan}: {plan: PlatformSubscriptionPlan}) => {
    const { updatePlan } = usePlatformPlan();
    const [formData, setFormData] = useState<FormData>({
        name: plan.name,
        description: plan.description || '',
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice || null,
        transactionFeePercentage: plan.transactionFeePercentage,
        isCustom: plan.isCustom,
        isDefault: plan.isDefault,
        isActive: plan.isActive,
    });
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        updatePlan(plan.id, formData);
    }
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
  return (
    <div className="flex flex-col gap-4">
        <div>
            <h1 className="text-xl font-semibold text-[#1B3155]">Plan Details</h1>
        </div>
        <div>
           <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 w-full">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="flex gap-2 w-full">
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="monthlyPrice">Monthly Price</label>
                    <input type="number" id="monthlyPrice" name="monthlyPrice" value={formData.monthlyPrice} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="annualPrice">Annual Price</label>
                    <input type="number" id="annualPrice" name="annualPrice" value={formData.annualPrice || ''} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="transactionFeePercentage">Transaction Fee Percentage</label>
                    <input type="number" id="transactionFeePercentage" name="transactionFeePercentage" value={formData.transactionFeePercentage} onChange={handleChange} />
                </div>
            </div>
            <div className="flex gap-2">
                <label htmlFor="isActive">Is Active</label>
                <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} />
            </div>
            <div className="flex gap-2">
                <button className="bg-[#7E37D8] text-white px-4 py-2 rounded-md" type="submit">Save</button>
            </div>
           </form>
        </div>
    </div>
  )
}

export default EditPlatformPlanForm