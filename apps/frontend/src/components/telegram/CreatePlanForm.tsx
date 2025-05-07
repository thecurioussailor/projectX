import { useState, useEffect } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import { TelegramChannel } from "../../store/useTelegramStore";
import { FaTrash } from "react-icons/fa";

interface Plan {
  name: string;
  price: number;
  duration: number;
}

interface CreatePlanFormProps {
  onPlanCreated: (plan: Plan) => void;
  channel: TelegramChannel;
}

const CreatePlanForm = ({ onPlanCreated, channel }: CreatePlanFormProps) => {
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [planDurationType, setPlanDurationType] = useState("Day");
  const [planDurationValue, setPlanDurationValue] = useState("");
  const { createPlan, fetchPlans, deletePlan, isLoading, error, plans } = useTelegram();
  
  useEffect(() => {
    // Fetch plans when component mounts
    fetchPlans(channel.id);
  }, [channel.id, fetchPlans]);
  
  const handleCreatePlan = async () => {
    if (!planName || !planPrice || !planDurationValue) return;
    
    try {
      const price = parseFloat(planPrice);
      let duration = 0;
      if(planDurationType === "Day") {
        duration = parseInt(planDurationValue);
      } else if(planDurationType === "Week") {
        duration = parseInt(planDurationValue) * 7;
      } else if(planDurationType === "Month") {
        duration = parseInt(planDurationValue) * 30;
      } else if(planDurationType === "Year") {
        duration = parseInt(planDurationValue) * 365;
      } else if(planDurationType === "Lifetime") {
        duration = 365 * 10;
      }
      
      if (isNaN(price) || isNaN(duration)) {
        throw new Error("Invalid price or duration");
      }
      
      const planData = {
        name: planName,
        price,
        duration
      };
      
      await createPlan(channel.id, planData);
      
      // Call onPlanCreated with the plan data
      onPlanCreated(planData);
      
      // Reset form
      setPlanName("");
      setPlanPrice("");
      setPlanDurationType("Day");
      setPlanDurationValue("");
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deletePlan(planId);
      // Refresh plans after deletion
      fetchPlans(channel.id);
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Channel Created Successfully</h3>
          <div className="flex flex-col gap-1 mb-2">
              <p className="text-sm font-medium">Name: <span className="font-normal">{channel.channelName}</span></p>
              <p className="text-sm font-medium">Description: <span className="font-normal">{channel.channelDescription}</span></p>
          </div>
      </div>
      
      {plans && plans.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Current Plans:</h4>
          <div className="space-y-2 max-h-44 md:max-h-48 overflow-y-auto">
            {plans.map((plan, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{plan.name}</p>
                  <p className="text-sm">{plan.price} INR / {plan.duration} days</p>
                </div>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium mb-2">Add New Plan</h3>
        <label className="text-sm font-medium text-gray-700" htmlFor="plan-name">
          Plan Name
        </label>
        <input
          type="text"
          id="plan-name"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="e.g. Monthly, Yearly, etc."
          className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
          required
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="plan-price">
          Price (INR)
        </label>
        <input
          type="number"
          id="plan-price"
          value={planPrice}
          onChange={(e) => setPlanPrice(e.target.value)}
          placeholder="e.g. 9.99"
          min="0"
          step="0.01"
          className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
          required
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="plan-duration">
          Duration Type
        </label>
        <select
          id="plan-duration"
          value={planDurationType}
          onChange={(e) => setPlanDurationType(e.target.value)}
          className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
        >
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
          <option value="Lifetime">Lifetime</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="plan-duration">
          Duration ({planDurationType})
        </label>
        <input
          type="number"
          id="plan-duration"
          value={planDurationValue}
          onChange={(e) => setPlanDurationValue(e.target.value)}
          placeholder="e.g. 30"
          className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
        />
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <button
        onClick={handleCreatePlan}
        disabled={isLoading || !planName || !planPrice || !planDurationValue || !planDurationType}
        className="bg-[#7F37D8] text-white py-2 px-4 w-40 rounded-3xl hover:bg-[#6C2EB9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating..." : "Add Plan"}
      </button>
    </div>
  );
};

export default CreatePlanForm;
