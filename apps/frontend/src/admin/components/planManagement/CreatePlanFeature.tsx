import { useState } from "react";
import { useFeature } from "../../hooks/useFeature";
import { PlatformSubscriptionPlan } from "../../store/usePlatformPlanStore";
import { Feature } from "../../store/useFeatureStore";
import { FaTrash } from "react-icons/fa";
const CreatePlanFeature = ({plan}: {plan: PlatformSubscriptionPlan}) => {
  const { features, createFeature, isLoading } = useFeature(plan.id);
  const [formData, setFormData] = useState({
    featureKey: '',
    limitValue: 0,
    isEnabled: false,
  });
  const handleCreateFeature = () => {
    console.log(formData);
    createFeature(formData, plan.id);
  };
  return (
    <div className="flex flex-col gap-4">
        <div>
            <h1 className="text-xl font-semibold text-[#1B3155]">Feature Details</h1>
        </div>
        <div>
           <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full">
                <label htmlFor="name">Feature Key</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.featureKey}
                    onChange={(e) => setFormData({...formData, featureKey: e.target.value})}
                    className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <label htmlFor="monthlyPrice">Limit Value</label>
                <input 
                    type="number" 
                    id="monthlyPrice" 
                    name="monthlyPrice" 
                    value={formData.limitValue} 
                    onChange={(e) => setFormData({...formData, limitValue: parseInt(e.target.value)})}
                    className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                />
            </div>
            <div className="flex gap-2">
                <label htmlFor="isActive">Is Enabled</label>
                <input 
                    type="checkbox" 
                    id="isActive" 
                    name="isActive" 
                    checked={formData.isEnabled}
                    onChange={(e) => setFormData({...formData, isEnabled: e.target.checked})}
                    className=""
                />
            </div>
            <div className="flex gap-2">
                <button 
                    className="bg-[#7E37D8] text-white px-4 py-2 rounded-md" 
                    type="submit"
                    disabled={isLoading}
                    onClick={handleCreateFeature}
                >
                    {isLoading ? 'Adding...' : 'Add'}
                </button>
            </div>
           </form>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#1B3155]">Features</h1>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} planId={plan.id}/>
            ))}
          </div>
        </div>
    </div>
  )
}

export default CreatePlanFeature

const FeatureCard = ({feature, planId}: {feature: Feature, planId: string}) => {
  const { deleteFeature } = useFeature(planId);
  const  handleDelete = () => {
    deleteFeature(feature.id);
  }             
  return (
    <div className="flex flex-col gap-2 border border-gray-300 rounded-3xl p-4 w-full">
      <div className="flex justify-between">
        <h1>{feature.featureKey}</h1>
        <div>
          <button
            onClick={handleDelete}
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <p>{feature.limitValue}</p>
      <p>{feature.isEnabled ? 'Enabled' : 'Disabled'}</p>
    </div>
  )
}
