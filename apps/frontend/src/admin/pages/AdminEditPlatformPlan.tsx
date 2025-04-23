import { useParams } from "react-router-dom";
import { usePlatformPlan } from "../hooks/usePlatformPlan";
import { useEffect } from "react";
import EditPlatformPlanForm from "../components/planManagement/EditPlatformPlanForm";
const AdminEditPlatformPlan = () => {
    const { id } = useParams();
    const { currentPlan, fetchPlanById } = usePlatformPlan();

    useEffect(() => {
        console.log(id);
        if (id) {
            fetchPlanById(id);
        }
    }, [id, fetchPlanById]);
  return (
    <section className="flex flex-col gap-8">
    <div className="flex justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#7F37D8]">Edit Platform Plan</h1>
    </div>
    <div className="flex justify-between gap-4 bg-white rounded-[3rem] w-full overflow-clip shadow-lg shadow-purple-100">
            <div className="flex flex-col gap-4 w-full">
                <div className="relative ml-8 mt-8">
                    <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
                    <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
                    <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
                    <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
                    <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
                    <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
                </div>
                <div className="flex flex-col gap-4 pb-10 px-12">
                    <h1 className="text-2xl  font-bold text-[#1B3155]">{currentPlan?.name}</h1>
                    <p className="text-sm text-gray-500">{currentPlan?.description}</p>
                </div>
                <div className="flex flex-col gap-4 pb-10 pt-10 px-12 border-t border-gray-200">
                    {currentPlan && <EditPlatformPlanForm plan={currentPlan} />}
                </div>
            </div>
    </div>
</section>
  )
}

export default AdminEditPlatformPlan