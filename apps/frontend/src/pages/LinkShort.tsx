import { useState } from 'react';
import UrlShortner from '../components/links/UrlShortner';
import LinkTable from '../components/links/LinkTable';

const LinkShort = () => {
  const [open, setOpen] = useState(false);
  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#7F37D8]">URL Shortener</h1>
        <button className="bg-[#7F37D8] font-semibold text-white py-2 px-4 rounded-3xl hover:bg-[#6C2EB9] transition-colors" onClick={() => setOpen(true)}>Create Short Link</button>
      </div>

      {/* URL shortener form */}
      {open && <UrlShortner setOpen={setOpen}/>}
      {/* Link Table */}
      <LinkTable />
    </section>
  );
};

export default LinkShort;