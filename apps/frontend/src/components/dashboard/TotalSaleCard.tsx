import React from "react";

interface TotalSaleCardProps {
  amount: string;
  gradient: string;
  title: string;
}

const TotalSaleCard: React.FC<TotalSaleCardProps> = ({ amount, gradient, title }) => {
  return (
    <div
      className={`flex flex-row justify-center gap-6 items-center w-72 h-44 rounded-3xl text-white shadow-lg ${gradient}`}
    >
      <div className="flex items-end space-x-2">
            <span className=" w-1 h-6 bg-white/60 rounded-sm"></span>
            <span className=" w-1 h-4 bg-white/60 rounded-sm"></span>
            <span className=" w-1 h-8 bg-white/60 rounded-sm"></span>
            <span className=" w-1 h-5 bg-white/60 rounded-sm"></span>
            <span className="w-1 h-3 bg-white/60 rounded-sm"></span>
      </div>
      <div>
        <p className="text-xl font-bold mt-2 tracking-wider">${amount}</p>
        <p className="text-white text-xl font-bold tracking-wider">{title}</p>
      </div>
    </div>
  );
};

export default TotalSaleCard;