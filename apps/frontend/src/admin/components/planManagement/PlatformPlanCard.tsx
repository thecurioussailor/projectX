import { FaTrash } from "react-icons/fa"
import { FaRegEdit } from "react-icons/fa"
import { PlatformSubscriptionPlan } from "../../store/usePlatformPlanStore"
import { usePlatformPlan } from "../../hooks/usePlatformPlan";
import { useNavigate } from "react-router-dom";
const PlatformPlanCard = ({plan}: {plan: PlatformSubscriptionPlan}) => {
  const { deletePlan } = usePlatformPlan();
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white rounded-[3rem] p-8 overflow-clip shadow-lg shadow-purple-100">
          <div className="relative">
              <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
              <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
              <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
              <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
              <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
              <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
          </div>
          <div className="p-4 px-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-4 items-center">
                <h1 className="font-bold text-xl">{plan.name}</h1>
                <p className="text-sm text-gray-500">{plan.deletedAt ? "Deleted" : "Active"}</p>
              </div>
              <div className="flex gap-4">
                <div><FaRegEdit onClick={() => navigate(`/admin/plan-management/${plan.id}`)} /></div>
                {!plan.deletedAt && <div><FaTrash onClick={() => deletePlan(plan.id)} /></div>}
              </div>
            </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">{plan.description}</p>
                <p className="text-sm text-gray-500">Monthly Price: ${plan.monthlyPrice}</p>
                <p className="text-sm text-gray-500">Annual Price: ${plan.annualPrice}</p>
                <p className="text-sm text-gray-500">Transaction Fee: {plan.transactionFeePercentage}%</p>
                <p className="text-sm text-gray-500">Is Default: {plan.isDefault ? "Yes" : "No"}</p>
                <p className="text-sm text-gray-500">Is Active: {plan.isActive ? "Yes" : "No"}</p>
                <p className="text-sm text-gray-500">Created At: {new Date(plan.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Updated At: {new Date(plan.updatedAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Deleted At: {plan.deletedAt ? new Date(plan.deletedAt).toLocaleDateString() : "None"}</p>
              </div>
          </div>
      </div>
  )
}

export default PlatformPlanCard