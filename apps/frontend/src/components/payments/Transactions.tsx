import { useState } from "react";
import { GoCopy } from "react-icons/go";
import { GoCheck } from "react-icons/go";
import { IoShareSocialOutline } from "react-icons/io5";

const Transactions = () => {
    const [copied, setCopied] = useState(false);
  return (
    <div className="flex justify-between gap-4 bg-white rounded-[3rem] w-full overflow-clip shadow-lg shadow-purple-100">
            <div className="flex flex-col gap-4 w-full">
                <div className="relative ml-8 mt-8">
                    <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
                    <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
                    <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
                    <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
                    <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
                    <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
                </div>
                <h1 className="text-2xl pb-10 px-12 font-bold text-[#1B3155]">Transactions</h1>
                {/* tabular view */}
                <table className="w-full text-left">
                    <thead className=" border-gray-300 h-20">
                        <tr className="border-t border-gray-200">
                            <th className="w-1/12 px-8">#</th>
                            <th className="w-2/12">Name</th>
                            <th className="w-1/12">Status</th>
                            <th className="w-1/12">Price</th>
                            <th className="w-1/12">Revenue</th>
                            <th className="w-1/12">Sales</th>
                            <th className="w-1/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr className="border-t border-gray-200 h-20">
                        <td className="px-8">1</td>
                        <td>Digital Product 1</td>
                        <td>Active</td>
                        <td>1</td>
                        <td>100</td>
                        <td>100</td>
                        <td>
                            <div className="flex items-center bg-[#7F37D8] rounded-3xl text-white w-40">
                                <button 
                                                                        
                                    className="border-r flex items-center gap-2 border-white px-4 py-2 w-2/3"><IoShareSocialOutline size={20}/> Share</button>
                                <button 
                                    onClick={() => setCopied(!copied)}
                                    className="px-4 py-2 rounded-r-3xl w-1/3">{copied ? <GoCheck size={20} /> : <GoCopy size={20} />}</button>
                            </div>
                        </td>
                    </tr>  
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default Transactions