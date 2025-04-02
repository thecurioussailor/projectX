// import { useEffect, useState } from "react";
// import { useDigitalProductStore } from "../store/useDigitalProductStore";
// import LoadingSpinner from "../components/ui/LoadingSpinner";
// import { FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// const DigitalProducts = () => {
//   const navigate = useNavigate();
//   // const { products, isLoading, error, fetchProducts, deleteProduct } = useDigitalProductStore();
//   // const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   // const handleDelete = async (id: string) => {
//   //   try {
//   //     await deleteProduct(id);
//   //     setShowDeleteConfirm(null);
//   //   } catch (error) {
//   //     console.error('Failed to delete product:', error);
//   //   }
//   // };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 p-6 rounded-lg max-w-lg text-center">
//         <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
//         <p className="text-red-600">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-4 bg-white rounded-3xl w-full p-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold">Digital Products</h1>
//         <button
//           onClick={() => navigate('/digital-products/create')}
//           className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
//         >
//           <FiPlus className="w-5 h-5" />
//           Create Product
//         </button>
//       </div>

//       {products.length === 0 ? (
//         <div className="text-center py-8">
//           <p className="text-gray-500">No digital products found. Create your first product to get started!</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-4 px-6">Title</th>
//                 <th className="text-left py-4 px-6">Category</th>
//                 <th className="text-left py-4 px-6">Price</th>
//                 <th className="text-left py-4 px-6">Status</th>
//                 <th className="text-left py-4 px-6">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product) => (
//                 <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
//                   <td className="py-4 px-6">
//                     <div className="flex items-center gap-3">
//                       {product.coverImage && (
//                         <img
//                           src={product.coverImage}
//                           alt={product.title}
//                           className="w-12 h-12 object-cover rounded-lg"
//                         />
//                       )}
//                       <div>
//                         <h3 className="font-medium">{product.title}</h3>
//                         <p className="text-sm text-gray-500">{product.description}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">{product.category || 'Uncategorized'}</td>
//                   <td className="py-4 px-6">
//                     {product.hasDiscount ? (
//                       <div>
//                         <span className="text-red-600">${product.discountedPrice}</span>
//                         <span className="text-gray-400 line-through ml-2">${product.price}</span>
//                       </div>
//                     ) : (
//                       <span>${product.price}</span>
//                     )}
//                   </td>
//                   <td className="py-4 px-6">
//                     <span className={`px-2 py-1 rounded-full text-sm ${
//                       product.status === 'ACTIVE'
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {product.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() => navigate(`/digital-products/${product.id}`)}
//                         className="text-blue-600 hover:text-blue-800"
//                       >
//                         <FiEye className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => navigate(`/digital-products/${product.id}/edit`)}
//                         className="text-purple-600 hover:text-purple-800"
//                       >
//                         <FiEdit2 className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => setShowDeleteConfirm(product.id)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         <FiTrash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
      
//     </div>
//   );
// };

// export default DigitalProducts; 