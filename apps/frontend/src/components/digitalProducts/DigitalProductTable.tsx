import { useState } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { GoCheck, GoCopy } from "react-icons/go";

const DigitalProductTable = () => {
    const [copied, setCopied] = useState(false);
  return (
    <div className="flex justify-between gap-4 bg-white rounded-3xl w-full">
            <div className="flex flex-col gap-4 w-full">
                <h1 className="text-xl py-10 font-semibold px-8">Digital Products</h1>
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

export default DigitalProductTable