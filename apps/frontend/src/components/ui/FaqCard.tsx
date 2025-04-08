import { useState } from "react";

const FaqCard = ({title, content}: {title: string, content: string}) => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
    <h2 className="bg-[#7F37D8] rounded-t-3xl text-sm text-white font-semibold px-8 py-4">
        <button 
        onClick={() => setIsOpen(!isOpen)}
        type="button" 
        className="flex items-center justify-between w-full">
        {title}
        </button>
    </h2>
    {isOpen && (
        <div className="py-6 border-b border-x border-zinc-200 text-sm px-8 rounded-b-3xl transition-all duration-300 ease-in-out bg-white">
        {content}
        </div>
    )}
    </div>
  )
}

export default FaqCard