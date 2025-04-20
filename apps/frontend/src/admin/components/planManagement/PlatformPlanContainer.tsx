import { usePlatformPlan } from "../../hooks/usePlatformPlan";
import PlatformPlanCard from "./PlatformPlanCard"
const PlatformPlanContainer = () => {
    const { plans } = usePlatformPlan({autoFetch: true});
  return (
    <div className="grid grid-cols-4 gap-4 w-full">
        {plans?.map((plan) => (
            <PlatformPlanCard key={plan.id} plan={plan}/>
        ))}
    </div>
  )
}

export default PlatformPlanContainer