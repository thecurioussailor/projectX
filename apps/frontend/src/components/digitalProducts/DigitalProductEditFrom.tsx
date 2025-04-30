import { useEffect, useState } from "react";
import BasicInformation from "./BasicInformation";
import UploadProduct from "./UploadProduct";
import PublishProduct from "./PublishProduct";
import { useDigitalProduct } from "../../hooks/useDigitalProduct";

const DigitalProductEditFrom = ({ productId }: { productId: string }) => {
    const [activeTab, setActiveTab] = useState("basic");
    const { currentProduct, fetchProductById } = useDigitalProduct();

    useEffect(() => {
        console.log("Fetching product with ID:", productId);
        fetchProductById(productId);
    }, [productId, fetchProductById]);

    if (!currentProduct) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Product not found</div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col justify-between gap-4 bg-white rounded-3xl">
            <div className="flex justify-between items-center px-8 py-8 gap-8 w-full border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between w-full gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-semibold">{activeTab === "basic" ? "Basic Information" : activeTab === "upload" ? "Upload Product" : "Publish Product"}</h1>
                        <p className="text-sm text-gray-500 mt-1">{currentProduct.title}</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            className={`py-2 px-2 transition-colors ${activeTab === "basic" ? "border-b-2 border-b-[#7F37D8] text-[#7F37D8] font-semibold" : "border-b-2 border-b-transparent"}`}
                            onClick={() => setActiveTab("basic")}
                        >
                            Basic
                        </button>
                        <button 
                            className={`py-2 px-2 transition-colors ${activeTab === "upload" ? "border-b-2 border-b-[#7F37D8] text-[#7F37D8] font-semibold" : "border-b-2 border-b-transparent"}`}
                            onClick={() => setActiveTab("upload")}
                        >
                            Upload
                        </button>
                        <button 
                            className={`py-2 px-2 transition-colors ${activeTab === "publish" ? "border-b-2 border-b-[#7F37D8] text-[#7F37D8] font-semibold" : "border-b-2 border-b-transparent"}`}
                            onClick={() => setActiveTab("publish")}
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </div> 
            <div className="flex px-8 py-8 w-full">
                {activeTab === "basic" && <BasicInformation currentProduct={currentProduct} />}
                {activeTab === "upload" && <UploadProduct currentProduct={currentProduct} />}
                {activeTab === "publish" && <PublishProduct currentProduct={currentProduct} />}
            </div>
        </div>
    );
};

export default DigitalProductEditFrom;