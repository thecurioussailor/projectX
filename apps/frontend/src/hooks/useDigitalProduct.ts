import { useDigitalProductStore } from "../store/useDigitalProductStore";
const FileType = {
    IMAGE: "IMAGE",
    PDF: "PDF",
    VIDEO: "VIDEO",
    AUDIO: "AUDIO",
    DOCUMENT: "DOCUMENT",
    LINK: "LINK",
    OTHER: "OTHER"
};
const getFileType = (mimeType: string) => {
    console.log("getFileType", mimeType);
    if (mimeType.startsWith("image/")) return FileType.IMAGE;
    if (mimeType === "application/pdf") return FileType.PDF;
    if (mimeType.startsWith("video/")) return FileType.VIDEO;
    if (mimeType.startsWith("audio/")) return FileType.AUDIO;
    if (mimeType.includes("officedocument") || mimeType.includes("msword")) return FileType.DOCUMENT;
    if (mimeType.startsWith("text/")) return FileType.LINK; // Assuming text files are links (adjust as needed)
    return FileType.OTHER;
};

export const useDigitalProduct = () => {
    const {
        // State
        products,
        currentProduct,
        isLoading,
        error,
        
        // Product methods
        createProduct,
        fetchProducts,
        fetchProductById,
        fetchPublicProductBySlug,
        updateProduct,
        deleteProduct,
        setCurrentProduct,
        publishProduct,
        unpublishProduct,
        
        // File methods
        getFileUploadUrl,
        uploadFileToS3,
        uploadDigitalProductFile,
        getDigitalProductFiles, 
        deleteFile,
        
        // Testimonial methods
        createTestimonial,
        getTestimonials,
        updateTestimonial,
        deleteTestimonial,
        
        // FAQ methods
        createFaq,
        getFaqs,
        updateFaq,
        deleteFaq,
        
        // Registration question methods
        createRegistrationQuestion,
        getRegistrationQuestions,
        updateRegistrationQuestion,
        deleteRegistrationQuestion,
        
        // Support detail methods
        createSupportDetail,
        getSupportDetails,
        updateSupportDetail,
        deleteSupportDetail
    } = useDigitalProductStore();

    // Helper for complete file upload process
    const uploadFile = async (productId: string, file: File) => {
        try {
            console.log("uploadFile", productId, file);
            const mimeType = getFileType(file.type);
            const { uploadUrl, s3Key, fileType } = await getFileUploadUrl(
                productId, 
                file.name, 
                mimeType
            );
            
            // Step 2: Upload file to S3
            await uploadFileToS3(uploadUrl, file);
            
            // Step 3: Upload file to database
            const fileRecord = await uploadDigitalProductFile(productId, s3Key, fileType);
            
            // Return the file record from the database
            return fileRecord;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    };

    return {
        // State
        products,
        currentProduct,
        isLoading,
        error,
        
        // Product methods
        createProduct,
        fetchProducts,
        fetchProductById,
        fetchPublicProductBySlug,
        updateProduct,
        deleteProduct,
        setCurrentProduct,
        publishProduct,
        unpublishProduct,
        
        // File methods
        uploadFile, // Custom helper that combines getUploadUrl and uploadToS3
        getDigitalProductFiles,
        deleteFile,
        
        // Testimonial methods
        createTestimonial,
        getTestimonials,
        updateTestimonial,
        deleteTestimonial,
        
        // FAQ methods
        createFaq,
        getFaqs,
        updateFaq,
        deleteFaq,
        
        // Registration question methods
        createRegistrationQuestion,
        getRegistrationQuestions,
        updateRegistrationQuestion,
        deleteRegistrationQuestion,
        
        // Support detail methods
        createSupportDetail,
        getSupportDetails,
        updateSupportDetail,
        deleteSupportDetail
    };
};
