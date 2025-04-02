import { useEffect, useState, useRef } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { GoCheck, GoCopy } from "react-icons/go";
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { DigitalProduct } from "../../store/useDigitalProductStore";
import LoadingSpinner from "../ui/LoadingSpinner";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const DigitalProductTable = () => {
    const { products, isLoading, error, fetchProducts } = useDigitalProduct();
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-full">
                <LoadingSpinner/>
            </div>
        )
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

  return (
    <div className="flex justify-between gap-4 bg-white rounded-3xl w-full">
            <div className="flex flex-col gap-4 w-full">
                <h1 className="text-xl py-10 font-semibold px-8">Digital Products</h1>
                {/* tabular view */}
                <table className="w-full text-left">
                    <thead className=" border-gray-300 h-20">
                        <tr className="border-t border-gray-200">
                            <th className="w-1/12 px-8">#</th>
                            <th className="w-2/12">Title</th>
                            <th className="w-1/12">Category</th>
                            <th className="w-1/12">Price</th>
                            <th className="w-1/12">Status</th>
                            <th className="w-1/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <ProductRow key={product.id} product={product} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default DigitalProductTable

const ProductRow = ({ product, index }: { product: DigitalProduct, index: number }) => {
    const [copied, setCopied] = useState(false);
    const { deleteProduct } = useDigitalProduct();
    const [showMenu, setShowMenu] = useState(false);  
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const navigate = useNavigate();
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []); 

    return (
        <tr className="border-t border-gray-200 h-20">
            <td className="px-8">{index + 1}</td>
            <td>{product.title}</td>
            <td>{product.category}</td>
            <td>{product.price}</td>
            <td>{product.status}</td>
            <td>
                <div className="flex relative items-center bg-[#7F37D8] rounded-3xl text-white w-40">
                    <button 
                                                            
                        className="border-r flex items-center gap-2 border-white px-4 py-2 w-2/3"><IoShareSocialOutline size={20}/> Share</button>
                    <button 
                        onClick={() => setCopied(!copied)}
                        className="px-4 py-2 rounded-r-3xl w-1/3">{copied ? <GoCheck size={20} /> : <GoCopy size={20} />}</button>
                    <button 
                        ref={ref}
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-[#7F37D8] ml-4 p-2 hover:bg-gray-100 rounded-full"><HiOutlineDotsVertical /></button>
                    {showMenu && (
                        <div className="absolute z-10 top-12 -right-16">
                            <div className="flex flex-col rounded-3xl bg-white overflow-clip">
                            <button 
                                onClick={() => {
                                    navigate(`/digital-products/${product.id}/edit`);
                                }}
                                className="text-zinc-800 flex items-center gap-2 hover:bg-purple-600 hover:text-white px-4 py-2"
                            >
                                <FaEdit size={15}/> Edit
                            </button>
                            <button className="text-zinc-800 flex items-center gap-2 hover:bg-purple-600 hover:text-white px-4 py-2"><FaEye size={15}/> Unpublish</button>
                            <button 
                                onClick={() => setShowDeleteConfirm(product.id)}   
                                className="text-zinc-800 flex items-center gap-2 hover:bg-purple-600 hover:text-white px-4 py-2"
                            >
                                <FaTrash size={15}/> Delete
                            </button>
                            </div>
                        </div>
                    )}  
                    {/* delete confirmation modal */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-3xl max-w-md w-full">
                            <h2 className="text-xl font-semibold mb-4 text-zinc-800 border-b border-gray-200 pb-4">Delete Product</h2>
                            <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this product? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteProduct(showDeleteConfirm)}
                                className="px-4 py-2 bg-[#7F37D8] text-white rounded-3xl hover:bg-[#6C2EB9]"
                            >
                                Delete
                            </button>
                            </div>
                        </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>  
    )
}   
