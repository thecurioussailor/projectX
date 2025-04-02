import DigitalProductTable from "../components/digitalProducts/DigitalProductTable"
import { useState } from "react";
import CreateDigitalProductDraft from "../components/digitalProducts/CreateDigitalProductDraft";
const DigitalProduct = () => {
  const [open, setOpen] = useState(false);
  return (
    <section className="flex flex-col gap-6">
        <div className="flex justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#7F37D8]">Digital Product</h1>
            <button 
              className="bg-[#7F37D8] font-semibold text-white py-2 px-4 rounded-3xl hover:bg-[#6C2EB9] transition-colors" 
              onClick={() => setOpen(true)}
            >
              Create Product
            </button>
        </div>
        <div className="flex justify-between gap-4 w-full">
          <DigitalProductTable />
        </div>
        {open && <CreateDigitalProductDraft setOpen={setOpen} />}
    </section>
  )
}

export default DigitalProduct