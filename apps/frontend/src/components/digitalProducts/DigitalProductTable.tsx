import { useEffect, useState, useRef } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { GoCheck, GoCopy } from "react-icons/go";
import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { DigitalProduct } from "../../store/useDigitalProductStore";
import LoadingSpinner from "../ui/LoadingSpinner";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Error from "../ui/Error";
import { BsThreeDots } from "react-icons/bs";
import Warning from "../ui/Warning";
import { CiCircleList, CiGrid41, CiSearch } from "react-icons/ci";

const PUBLIC_APP_URL = import.meta.env.VITE_PUBLIC_APP_URL;

const DigitalProductTable = () => {
    const { products, isLoading, error, fetchProducts } = useDigitalProduct();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
    const [sortBy, setSortBy] = useState<"title" | "price" | "sales">("title");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [isGridView, setIsGridView] = useState(() => {
        return window.innerWidth < 1024;
    });

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const handleResize = () => {
            const isMobileOrTablet = window.innerWidth < 1024;
            
            if (isMobileOrTablet && !isGridView) {
                setIsGridView(true);
            } else if (!isMobileOrTablet && isGridView) {
                setIsGridView(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isGridView]);

    const categories = ["ALL", ...new Set(products.map(product => product.category))];
    // Filter and sort products
    const filteredAndSortedProducts = products
        .filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || product.status === statusFilter;
            const matchesCategory = categoryFilter === "ALL" || product.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === "title") {
                return sortOrder === "asc" 
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            }
            if (sortBy === "price") {
                return sortOrder === "asc" 
                    ? Number(a.price) - Number(b.price)
                    : Number(b.price) - Number(a.price);
            }
            if (sortBy === "sales") {
                return sortOrder === "asc" 
                    ? (a._count?.orders || 0) - (b._count?.orders || 0)
                    : (b._count?.orders || 0) - (a._count?.orders || 0);
            }
            return 0;
        });

    if (isLoading) {
        return (
            <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <Error error={error} />;
    }

    if(products.length === 0) {
        return <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
            <p className="text-gray-600">No products found</p>
        </div>
    }
  return (
    <div className="flex justify-between gap-4 bg-white rounded-[3rem] w-full shadow-lg overflow-clip shadow-purple-100">
            <div className="flex flex-col gap-4 w-full">
                <div className="relative ml-8 mt-8">
                    <div className="absolute rounded-full bg-[#7E37D8] h-14 w-14 -top-6 -left-16"></div>
                    <div className="absolute rounded-full bg-[#7E37D8] h-1 w-1 top-2 left-4"></div>
                    <div className="absolute rounded-full bg-[#FE80B2] h-8 w-8 top-4 -left-12"></div>
                    <div className="absolute rounded-full bg-[#FE80B2] h-2 w-2 -top-2 left-2"></div>
                    <div className="absolute rounded-full bg-[#FFC717] h-8 w-8 -top-12 -left-4"></div>
                    <div className="absolute rounded-full bg-[#06B5DD] h-4 w-4 top-3 -left-2"></div>
                </div>
                <div className="flex flex-col lg:flex-row justify-between items-start px-12">
                    <h1 className="text-2xl pb-10 font-bold px-12 text-[#1B3155]">Digital Products</h1>
                    {/* Search and Filter Section */}
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                        {/* Search Bar */}
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                                <CiSearch size={20} className="absolute left-3 top-3 text-gray-400"/>
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category} className="text-sm">
                                        {category}
                                    </option>
                                ))}
                            </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
                                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
                                >
                                    <option value="ALL" className="text-sm">All Status</option>
                                    <option value="ACTIVE" className="text-sm">Active</option>
                                    <option value="INACTIVE" className="text-sm">Inactive</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                       
                        {/* Sort Options */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "title" | "price" | "sales")}
                                className="appearance-none px-4 py-2 pr-10 border border-gray-300 text-base text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
                            >
                                <option value="title" className="text-sm">Sort by Title</option>
                                <option value="price" className="text-sm">Sort by Price</option>
                                <option value="sales" className="text-sm">Sort by Sales</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        </div>
                        {/* Sort Order Toggle */}
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <button
                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                            >
                                {sortOrder === "asc" ? "↑" : "↓"}
                            </button>

                            <div className="cursor-pointer flex items-center gap-2">
                                <button 
                                className={`${isGridView ? "bg-gray-200" : "bg-white"} p-2 rounded-full`}
                                onClick={() => setIsGridView(true)}
                                >
                                    <CiCircleList size={20} />
                                </button>
                                <button 
                                className={`${isGridView ? "bg-white" : "bg-gray-200"} p-2 rounded-full`}
                                onClick={() => setIsGridView(false)}
                                >
                                    <CiGrid41 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Grid View */}
                {isGridView && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-10">
                    {filteredAndSortedProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>}
                {/* Table View */}
                {!isGridView && <div className="overflow-x-auto lg:overflow-x-hidden">
                    <table className="w-full text-left min-w-max lg:min-w-full">
                        <thead className=" border-gray-300 h-20">
                            <tr className="border-t border-gray-200">
                                <th className="lg:w-1/12 px-8">#</th>
                                <th className="lg:w-3/12 px-4">Title</th>
                                <th className="lg:w-1/12 px-4">Category</th>
                                <th className="lg:w-1/12 px-4">Price</th>
                                <th className="lg:w-1/12 px-4">Status</th>
                                <th className="lg:w-1/12 px-4">Sales</th>
                                <th className="lg:w-2/12 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedProducts.map((product, index) => (
                                <ProductRow key={product.id} product={product} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>}
            </div>
        </div>
  )
}

export default DigitalProductTable

const ProductCard = ({ product, index }: { product: DigitalProduct, index: number }) => {
    const [copied, setCopied] = useState(false);
    const { deleteProduct } = useDigitalProduct();
    const [showMenu, setShowMenu] = useState(false); 
    const [showWarning, setShowWarning] = useState(false); 
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

    const handleCopyLink = (productId: string) => {
        setCopied(true);
        navigator.clipboard.writeText(`${PUBLIC_APP_URL}/d/${productId}`);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    const handleShare = (productId: string) => {
        const shareableLink = `${PUBLIC_APP_URL}/d/${productId}`;
        window.open(shareableLink, '_blank');
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1B3155]">#{index + 1}</span>
                    <span className={`${product.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} text-xs font-semibold rounded-full px-3 py-1 flex items-center gap-1`}>
                        <div className={`${product.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"} w-2 h-2 rounded-full`}></div>
                        {product.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                </div>
                <div className="relative">
                    <button 
                        ref={ref}
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-[#7F37D8] p-2 hover:bg-gray-100 rounded-full"
                    >
                        <BsThreeDots size={20}/>
                    </button>
                    {showMenu && (
                        <div className="absolute z-50 -bottom-32 right-0 border border-gray-200 rounded-lg bg-white shadow-lg">
                            <div className="flex flex-col rounded-lg overflow-hidden">
                                <button 
                                    onClick={() => navigate(`/digital-products/${product.id}/edit`)}
                                    className="text-zinc-800 flex items-center gap-2 hover:bg-[#7F37D8] hover:text-white px-4 py-2 text-left"
                                >
                                    <FaEdit size={15}/> Edit
                                </button>
                                {product.status === "ACTIVE" ? (
                                    <button className="text-zinc-800 flex items-center gap-2 hover:bg-[#7F37D8] hover:text-white px-4 py-2 text-left">
                                        <FaEyeSlash size={15}/> Unpublish
                                    </button>
                                ): (
                                    <button className="text-zinc-800 flex items-center gap-2 hover:bg-[#7F37D8] hover:text-white px-4 py-2 text-left">
                                        <FaEye size={15}/> Publish
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowDeleteConfirm(product.id)}   
                                    className="text-zinc-800 flex items-center gap-2 hover:bg-[#7F37D8] hover:text-white px-4 py-2 text-left"
                                >
                                    <FaTrash size={15}/> Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Title */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#1B3155] line-clamp-2">
                    {product.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price</span>
                    <span className="text-lg font-bold text-[#7e37d8]">₹{product.price}</span>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sales</span>
                    <span className="text-sm font-medium text-[#158DF7]">{product._count?.orders || 0}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button 
                    onClick={() => {
                        if(product.status === "ACTIVE") {
                            handleShare(product.id); 
                        } else {
                            setShowWarning(true)
                        }
                    }}
                    className="flex-1 bg-[#7e37d8] hover:bg-[#6b2db5] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={product.status !== "ACTIVE"}
                >
                    <IoShareSocialOutline size={16} />
                    Share
                </button>
                <button 
                    onClick={() => {
                        if(product.status === "ACTIVE") {
                            handleCopyLink(product.id);
                        } else {
                            setShowWarning(true);
                        }
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                    disabled={product.status !== "ACTIVE"}
                >
                    {copied ? <GoCheck size={16} /> : <GoCopy size={16} />}
                </button>
            </div>

            {/* Warning Modal */}
            {showWarning && <Warning title="Product is inactive" message="Please activate the product to share it" onCancel={() => setShowWarning(false)} />}
            
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4 px-8 py-8 text-zinc-800 border-b border-gray-200 pb-4">Delete Product</h2>
                        <p className="text-gray-600 mb-6 px-8 py-2">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4 px-8 pb-8">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteProduct(showDeleteConfirm)}
                                className="px-8 py-2 bg-[#7F37D8] text-white rounded-3xl hover:bg-[#6C2EB9]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProductRow = ({ product, index }: { product: DigitalProduct, index: number }) => {
    const [copied, setCopied] = useState(false);
    const { deleteProduct } = useDigitalProduct();
    const [showMenu, setShowMenu] = useState(false); 
    const [showWarning, setShowWarning] = useState(false); 
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

    const handleCopyLink = (productId: string) => {
        setCopied(!copied);
        navigator.clipboard.writeText(`${PUBLIC_APP_URL}/d/${productId}`);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }
    const handleShare = (productId: string) => {
        const shareableLink = `${PUBLIC_APP_URL}/d/${productId}`;
        console.log(shareableLink);
        window.open(shareableLink, '_blank');
    };
    return (
        <tr className="border-t border-gray-200 h-20 hover:bg-gray-50">
            <td className="px-8">{index + 1}</td>
            <td className="px-4">{product?.title}</td>
            <td className="px-4">{product?.category}</td>
            <td className="px-4">{product?.price}</td>
            <td className="px-4"><div className={`border w-fit px-2 flex items-center gap-2 py-1 rounded-full`}><div className={`${product.status === "ACTIVE" ? "bg-green-500": "bg-red-500"} w-2 h-2 rounded-full`}></div><span className="text-xs">{product.status === "ACTIVE" ? "Active" : "Inactive"}</span></div></td>
            <td className="px-4">{product._count?.orders}</td>
            <td className="px-4">
                <div className="flex relative items-center bg-[#7F37D8] rounded-3xl text-white w-40">
                    <button 
                        onClick={() => {
                            if(product.status === "ACTIVE") {
                                handleShare(product.id); 
                            } else {
                                setShowWarning(true)
                            }
                        }}
                        className="border-r flex items-center gap-2 border-white px-4 py-2 w-2/3"
                    >
                        <IoShareSocialOutline size={20}/> Share
                    </button>
                    {showWarning && <Warning title="Product is inactive" message="Please activate the product to share it" onCancel={() => setShowWarning(false)} />}   
                    <button 
                        onClick={() => {
                            if(product.status === "ACTIVE") {
                                handleCopyLink(product.id);
                            } else {
                                setShowWarning(true);
                            }
                        }}
                        className="px-4 py-2 rounded-r-3xl w-1/3"
                    >
                        {copied ? <GoCheck size={20} /> : <GoCopy size={20} />}
                    </button>
                    <button 
                        ref={ref}
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-[#7F37D8] ml-4 px-2 py-1 hover:bg-gray-100 rounded-full"
                    >
                            <BsThreeDots size={20}/>
                    </button>
                    {showMenu && (
                        <div className="absolute z-50 -top-24 -right-10 border border-gray-200 rounded-3xl">
                            <div className="flex flex-col rounded-3xl bg-white overflow-clip">
                            <button 
                                onClick={() => {
                                    navigate(`/digital-products/${product.id}/edit`);
                                }}
                                className="text-zinc-800 flex items-center gap-2 hover:bg-[#7F37D8] hover:text-white px-4 py-2"
                            >
                                <FaEdit size={15}/> Edit
                            </button>
                            {product.status === "ACTIVE" ? (
                                <button className="text-zinc-800 flex items-center gap-2 hover:bg-[#7F37D8] hover:text-white px-4 py-2"><FaEyeSlash size={15}/> Unpublish</button>
                            ): (
                                <button className="text-zinc-800 flex items-center gap-2 hover:bg-[#7F37D8] hover:text-white px-4 py-2"><FaEye size={15}/> Publish</button>
                            )}
                            
                            <button 
                                onClick={() => setShowDeleteConfirm(product.id)}   
                                className="text-zinc-800 flex items-center gap-2 hover:bg-[#7F37D8] hover:text-white px-4 py-2"
                            >
                                <FaTrash size={15}/> Delete
                            </button>
                            </div>
                        </div>
                    )}  
                    {/* delete confirmation modal */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white rounded-3xl max-w-md w-full">
                                <h2 className="text-xl font-semibold mb-4 px-8 py-8 text-zinc-800 border-b border-gray-200 pb-4">Delete Product</h2>
                                <p className="text-gray-600 mb-6 px-8 py-2">
                                    Are you sure you want to delete this product? This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-4 px-8 pb-8">
                                    <button
                                        onClick={() => setShowDeleteConfirm(null)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(showDeleteConfirm)}
                                        className="px-8 py-2 bg-[#7F37D8] text-white rounded-3xl hover:bg-[#6C2EB9]"
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
