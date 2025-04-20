import { useUserMnt } from "../../hooks/useUserMnt";
import { BsThreeDots } from "react-icons/bs";
import { useState, useRef } from "react";
import { User } from "../../store/useUserMntStore";
import { useNavigate } from "react-router-dom";
const UsersTable = () => {
    const { users } = useUserMnt();
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
                <h1 className="text-2xl pb-10 px-12 font-bold text-[#1B3155]">Users</h1>
                {/* tabular view */}
                <table className="w-full text-left">
                    <thead className=" border-gray-300 h-20">
                        <tr className="border-t border-gray-200 text-[#1B3155]">
                            <th className="w-1/12 px-8">#</th>
                            <th className="w-2/12">Name</th>
                            <th className="w-2/12">Email</th>
                            <th className="w-2/12">Username</th>
                            <th className="w-2/12">Is Banned</th>
                            <th className="w-2/12">Created At</th>
                            <th className="w-2/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user, index) => (
                            <UsersTableRow key={index} user={user} index={index} />
                        ))}  
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default UsersTable

const UsersTableRow = ({user, index}: {user: User, index: number}) => {
    const [showMenu, setShowMenu] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    return (
        <tr className="border-t border-gray-200 h-20 text-[#1B3155]">
            <td className="px-8">{index + 1}</td>
            <td className="font-semibold">{user.name}</td>
            <td>{user.email}</td>
            <td>{user.username}</td>
            <td>{user.isBanned ? "Yes" : "No"}</td>
            <td>{new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</td>
            <td>
                <div 
                    ref={ref}
                    className="relative"
                >
                    <button   
                        onClick={() => setShowMenu(!showMenu)}
                        className="relative text-[#7F37D8] ml-4 px-2 py-1 hover:bg-gray-100 rounded-full"
                    >
                        <BsThreeDots size={20}/>
                    </button>
                    {showMenu && (
                        <div className="absolute z-10 top-8 right-8 border rounded-3xl bg-white overflow-clip">
                            <button     
                                className="text-zinc-800 flex items-center gap-2 hover:bg-purple-600 w-full border-b border-gray-200 hover:text-white px-4 py-2"
                                onClick={() => navigate(`/admin/user-management/${user.id}`)}
                            >
                                Profile  
                            </button>
                            <button className="text-zinc-800 flex items-center gap-2 hover:bg-purple-600 w-full hover:text-white px-4 py-2">
                                Ban  
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    )
}