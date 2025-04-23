import { usePlatformPlan } from "../../hooks/usePlatformPlan";
import PlatformPlanCard from "./PlatformPlanCard"
const PlatformPlanContainer = () => {
    const { plans } = usePlatformPlan();
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
        {plans?.map((plan) => (
            <PlatformPlanCard key={plan.id} plan={plan}/>
        ))}
    </div>
  )
}

export default PlatformPlanContainer