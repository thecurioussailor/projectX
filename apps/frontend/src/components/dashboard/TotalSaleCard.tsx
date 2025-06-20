import React, { useState } from "react";

interface TotalSaleCardProps {
  amount: string;
  gradient: string;
  title: string;
}

const TotalSaleCard: React.FC<TotalSaleCardProps> = ({ amount, gradient, title }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className={`relative flex flex-row justify-center gap-6 items-center w-72 h-40 rounded-[50px] text-white shadow-lg ${gradient} overflow-clip`}
    >
      <div className="flex items-end space-x-2">
            <span className=" w-1 h-6 bg-white/60 hover:bg-white/80 rounded-sm"></span>
            <span className=" w-1 h-4 bg-white/60 hover:bg-white/80 rounded-sm"></span>
            <span className=" w-1 h-8 bg-white/60 hover:bg-white/80 rounded-sm"></span>
            <span className=" w-1 h-5 bg-white/60 hover:bg-white/80 rounded-sm"></span>
            <span className="w-1 h-3 bg-white/60 hover:bg-white/80 rounded-sm"></span>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-xl font-semibold mt-2  tracking-wider">{amount}</p>
        <p className="text-white text-sm font-semibold tracking-wider">{title}</p>
      </div>
      <div className={`absolute bottom-4 right-4 ${isHovered ? "opacity-100" : "opacity-0"} transition-all duration-1000 ease-in-out`}>
        <div className="relative flex flex-row gap-2 h-4 w-4">
          <div className="bg-white rounded-full w-1 h-1 absolute -top-6 right-6"></div>
          <div className="bg-white rounded-full w-1 h-1 absolute -top-5 right-3"></div>
          <div className="bg-white rounded-full w-[6px] h-[6px]  absolute -top-2 right-0"></div>
          <div className="bg-white rounded-full w-[4px] h-[4px] absolute -top-3 -right-4"></div>
          <div className="bg-white rounded-full w-[6px] h-[6px] absolute top-1 right-6"></div>
          <div className="bg-white rounded-full w-1 h-1 absolute top-2 right-0"></div>
          <div className="bg-white rounded-full w-[4px] h-[4px] absolute -bottom-4 right-7"></div>
          <div className="bg-white rounded-full w-[6px] h-[6px] absolute -bottom-3 right-2"></div>
        </div>
      </div>
    </div>
  );
};

export default TotalSaleCard;
