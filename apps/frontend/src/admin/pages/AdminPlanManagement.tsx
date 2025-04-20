import { useState } from "react";
import CreatePlatformPlanForm from "../components/planManagement/CreatePlatformPlanForm";
import PlatformPlanContainer from "../components/planManagement/PlatformPlanContainer";
const AdminPlanManagement = () => {
  const [isCreatePlanFormOpen, setIsCreatePlanFormOpen] = useState(false);
  return (
    <section className="flex flex-col gap-8">
      <div className="flex justify-between gap-4">
        <div className="flex items-center gap-2 justify-between w-full">
          <h1 className="text-3xl font-bold text-[#7F37D8]">Plan Management</h1>
          <button className="bg-[#7F37D8] text-white px-4 py-2 rounded-md" onClick={() => setIsCreatePlanFormOpen(true)}>Create Platform Plan</button>
          {isCreatePlanFormOpen && <CreatePlatformPlanForm setOpen={setIsCreatePlanFormOpen} />}
        </div>
      </div>
      <div>
          <PlatformPlanContainer />
      </div>
    </section>
  )
}

export default AdminPlanManagement