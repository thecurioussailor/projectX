import React from "react";

interface MoneyCardProps {
  amount: number;
  gradient: string;
  title: string;
}

const MoneyCard: React.FC<MoneyCardProps> = ({ amount, gradient, title }) => {
  return (
    <div
      className={`flex flex-row justify-center gap-4 items-center w-64 h-44 rounded-2xl text-white shadow-lg ${gradient}`}
    >
      <div className="flex items-end space-x-2">
            <span className=" w-1 h-6 bg-white/60 rounded-sm"></span>
            <span className=" w-1 h-4 bg-white/60 rounded-sm"></span>
            <span className=" w-1 h-8 bg-white/60 rounded-sm"></span>
            <span className=" w-1 h-5 bg-white/60 rounded-sm"></span>
            <span className="w-1 h-3 bg-white/60 rounded-sm"></span>
      </div>
      <div>
        <p className="text-lg font-semibold mt-2">{amount} INR</p>
        <p className="text-white text-sm font-medium">{title}</p>
      </div>
    </div>
  );
};

export default MoneyCard;