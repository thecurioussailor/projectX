import ChannelTable from "../components/telegram/ChannelTable";
import CreateChannelDialog from "../components/telegram/CreateChannelDialog";
import { useState, useRef } from "react";

const Telegram = () => {
  const [open, setOpen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleChannelCreated = () => {
    // Force focus to the table for better UX
    if (tableRef.current) {
      tableRef.current.focus();
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#7F37D8]">Telegram</h1>
        <button 
          className="bg-[#7F37D8] font-semibold text-white py-2 px-4 rounded-3xl hover:bg-[#6C2EB9] transition-colors" 
          onClick={() => setOpen(true)}
        >
          Create Channel
        </button>
        {open && <CreateChannelDialog setOpen={setOpen} onChannelCreated={handleChannelCreated} />}
      </div>
      
      <div ref={tableRef} tabIndex={-1}>
        <ChannelTable />
      </div>
    </section>
  );
};

export default Telegram;