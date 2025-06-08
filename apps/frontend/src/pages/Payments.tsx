import { useState } from "react";
import Transactions from "../components/payments/Transactions"
import Wallet from "../components/payments/Wallet"

const Payments = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  return (
    <section className="flex flex-col gap-4 pb-16">
    <div className="flex justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#7F37D8]"> Payments </h1>
        <div className="flex gap-4">
          <button 
            className={`py-2 px-2 transition-colors ${activeTab === "transactions" ? "border-b-2 border-b-[#7F37D8] text-[#7F37D8] font-semibold" : "border-b-2 border-b-transparent"}`}
            onClick={() => setActiveTab("transactions")}
          >Transactions</button>
          <button 
            className={`py-2 px-2 transition-colors ${activeTab === "wallet" ? "border-b-2 border-b-[#7F37D8] text-[#7F37D8] font-semibold" : "border-b-2 border-b-transparent"}`}
            onClick={() => setActiveTab("wallet")}
          >Wallet</button>
        </div>
    </div>
    <div className="flex justify-between gap-6 w-full">      
        {activeTab === "transactions" && <Transactions />}
        {activeTab === "wallet" && <Wallet />}
    </div>
</section>
  )
}

export default Payments