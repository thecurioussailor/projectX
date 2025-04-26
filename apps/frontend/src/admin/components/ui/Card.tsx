import React from "react";

interface CardProps {
  gradient: string;
  text: string;
  number: number;
}

const Card: React.FC<CardProps> = ({ gradient, text, number }) => {
  return (
    <div
      className={`flex flex-row justify-center gap-6 items-center w-72 h-44 rounded-3xl text-white shadow-lg ${gradient}`}
    >
      <div className="flex items-end space-x-2">
            <span className=" w-1 h-6 bg-white/60 hover:bg-white/80 rounded-sm"></span>
            <span className=" w-1 h-4 bg-white/60 hover:bg-white/80 rounded-sm"></span>
            <span className=" w-1 h-8 bg-white/60 hover:bg-white/80 rounded-sm"></span>
            <span className=" w-1 h-5 bg-white/60 hover:bg-white/80 rounded-sm"></span>
            <span className="w-1 h-3 bg-white/60 hover:bg-white/80 rounded-sm"></span>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-xl font-semibold mt-2  tracking-wider">{text}</p>
        <p className="text-white text-sm font-semibold tracking-wider">{number}</p>
      </div>
    </div>
  );
};

export default Card;