import { useCallback } from 'react';
import { useDigitalProductStore, DigitalProduct, Testimonial, FAQ, RegistrationQuestion, SupportDetail } from '../store/useDigitalProductStore';
import { useAuthStore } from '../store/useAuthStore';

// Define file type mapping
const FileType = {
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    PDF: "PDF",
    LINK: "LINK",
    DOCUMENT: "DOCUMENT",
    AUDIO: "AUDIO",
    OTHER: "OTHER"
};

// Helper function to determine file type
const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return FileType.IMAGE;
    if (mimeType.startsWith("video/")) return FileType.VIDEO;
    if (mimeType === "application/pdf") return FileType.PDF;
    if (mimeType.includes("document") || mimeType.includes("msword") || mimeType.includes("officedocument")) return FileType.DOCUMENT;
    if (mimeType.startsWith("audio/")) return FileType.AUDIO;
    return FileType.OTHER;
};

/**
 * Custom hook for Digital Product functionality with authentication checks
 */
export const useDigitalProduct = () => {
    const { token } = useAuthStore();
    
    const {
        // State
        products,
        currentProduct,
        isLoading,
        error,
        
        // Store methods
        createProduct: storeCreateProduct,
        fetchProducts: storeFetchProducts,
        fetchProductById: storeFetchProductById,
        fetchPublicProductBySlug: storeFetchPublicProductBySlug,
        updateProduct: storeUpdateProduct,
        deleteProduct: storeDeleteProduct,
        setCurrentProduct,
        publishProduct: storePublishProduct,
        unpublishProduct: storeUnpublishProduct,
        
        // File Methods
        getFileUploadUrl: storeGetFileUploadUrl,
        uploadFileToS3: storeUploadFileToS3,
        uploadDigitalProductFile: storeUploadDigitalProductFile,
        getDigitalProductFiles: storeGetDigitalProductFiles,
        deleteFile: storeDeleteFile,
        
        // Testimonial Methods
        createTestimonial: storeCreateTestimonial,
        getTestimonials: storeGetTestimonials,
        updateTestimonial: storeUpdateTestimonial,
        deleteTestimonial: storeDeleteTestimonial,
        
        // FAQ Methods
        createFaq: storeCreateFaq,
        getFaqs: storeGetFaqs,
        updateFaq: storeUpdateFaq,
        deleteFaq: storeDeleteFaq,
        
        // Registration Question Methods
        createRegistrationQuestion: storeCreateRegistrationQuestion,
        getRegistrationQuestions: storeGetRegistrationQuestions,
        updateRegistrationQuestion: storeUpdateRegistrationQuestion,
        deleteRegistrationQuestion: storeDeleteRegistrationQuestion,
        
        // Support Detail Methods
        createSupportDetail: storeCreateSupportDetail,
        getSupportDetails: storeGetSupportDetails,
        updateSupportDetail: storeUpdateSupportDetail,
        deleteSupportDetail: storeDeleteSupportDetail,
        
        // Cover Image Methods
        getUploadCoverUrl: storeGetUploadCoverUrl,
        uploadCoverImage: storeUploadCoverImage,
        getCoverImage: storeGetCoverImage,

        //payments
        initiatePurchase: storeInitiatePurchase,
        handlePaymentCallback: storeHandlePaymentCallback,

        //Gallery Image Methods
        getUploadGalleryUrl: storeGetUploadGalleryUrl,
        uploadGalleryImage: storeUploadGalleryImage,
        getGalleryImage: storeGetGalleryImage
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

    // Product Methods with authentication check
    const createProduct = useCallback(async (data: Partial<DigitalProduct>) => {
        if (!token) {
            throw new Error('You must be logged in to create a product');
        }
        return storeCreateProduct(data);
    }, [token, storeCreateProduct]);
    
    const fetchProducts = useCallback(async () => {
        if (!token) {
            throw new Error('You must be logged in to fetch products');
        }
        return storeFetchProducts();
    }, [token, storeFetchProducts]);
    
    const fetchProductById = useCallback(async (id: string) => {
        if (!token) {
            throw new Error('You must be logged in to fetch a product');
        }
        return storeFetchProductById(id);
    }, [token, storeFetchProductById]);
    
    const fetchPublicProductBySlug = useCallback(async (slug: string) => {
        return storeFetchPublicProductBySlug(slug);
    }, [storeFetchPublicProductBySlug]);
    
    const updateProduct = useCallback(async (id: string, data: Partial<DigitalProduct>) => {
        if (!token) {
            throw new Error('You must be logged in to update a product');
        }
        return storeUpdateProduct(id, data);
    }, [token, storeUpdateProduct]);
    
    const deleteProduct = useCallback(async (id: string) => {
        if (!token) {
            throw new Error('You must be logged in to delete a product');
        }
        return storeDeleteProduct(id);
    }, [token, storeDeleteProduct]);
    
    const publishProduct = useCallback(async (id: string) => {
        if (!token) {
            throw new Error('You must be logged in to publish a product');
        }
        return storePublishProduct(id);
    }, [token, storePublishProduct]);
    
    const unpublishProduct = useCallback(async (id: string) => {
        if (!token) {
            throw new Error('You must be logged in to unpublish a product');
        }
        return storeUnpublishProduct(id);
    }, [token, storeUnpublishProduct]);

    // File Methods with authentication check
    const getFileUploadUrl = useCallback(async (productId: string, fileName: string, fileType: string) => {
        if (!token) {
            throw new Error('You must be logged in to get upload URL');
        }
        return storeGetFileUploadUrl(productId, fileName, fileType);
    }, [token, storeGetFileUploadUrl]);
    
    const uploadFileToS3 = useCallback(async (url: string, file: File) => {
        if (!token) {
            throw new Error('You must be logged in to upload a file');
        }
        return storeUploadFileToS3(url, file);
    }, [token, storeUploadFileToS3]);
    
    const uploadDigitalProductFile = useCallback(async (productId: string, s3Key: string, fileType: string) => {
        if (!token) {
            throw new Error('You must be logged in to upload a product file');
        }
        return storeUploadDigitalProductFile(productId, s3Key, fileType);
    }, [token, storeUploadDigitalProductFile]);
    
    const getDigitalProductFiles = useCallback(async (productId: string) => {
        if (!token) {
            throw new Error('You must be logged in to get product files');
        }
        return storeGetDigitalProductFiles(productId);
    }, [token, storeGetDigitalProductFiles]);
    
    const deleteFile = useCallback(async (productId: string, fileId: string) => {
        if (!token) {
            throw new Error('You must be logged in to delete a file');
        }
        return storeDeleteFile(productId, fileId);
    }, [token, storeDeleteFile]);

    // Testimonial Methods with authentication check
    const createTestimonial = useCallback(async (productId: string, data: Partial<Testimonial>) => {
        if (!token) {
            throw new Error('You must be logged in to create a testimonial');
        }
        return storeCreateTestimonial(productId, data);
    }, [token, storeCreateTestimonial]);
    
    const getTestimonials = useCallback(async (productId: string) => {
        if (!token) {
            throw new Error('You must be logged in to get testimonials');
        }
        return storeGetTestimonials(productId);
    }, [token, storeGetTestimonials]);
    
    const updateTestimonial = useCallback(async (testimonialId: string, data: Partial<Testimonial>) => {
        if (!token) {
            throw new Error('You must be logged in to update a testimonial');
        }
        return storeUpdateTestimonial(testimonialId, data);
    }, [token, storeUpdateTestimonial]);
    
    const deleteTestimonial = useCallback(async (testimonialId: string) => {
        if (!token) {
            throw new Error('You must be logged in to delete a testimonial');
        }
        return storeDeleteTestimonial(testimonialId);
    }, [token, storeDeleteTestimonial]);

    // FAQ Methods with authentication check
    const createFaq = useCallback(async (productId: string, data: Partial<FAQ>) => {
        if (!token) {
            throw new Error('You must be logged in to create an FAQ');
        }
        return storeCreateFaq(productId, data);
    }, [token, storeCreateFaq]);
    
    const getFaqs = useCallback(async (productId: string) => {
        if (!token) {
            throw new Error('You must be logged in to get FAQs');
        }
        return storeGetFaqs(productId);
    }, [token, storeGetFaqs]);
    
    const updateFaq = useCallback(async (faqId: string, data: Partial<FAQ>) => {
        if (!token) {
            throw new Error('You must be logged in to update an FAQ');
        }
        return storeUpdateFaq(faqId, data);
    }, [token, storeUpdateFaq]);
    
    const deleteFaq = useCallback(async (faqId: string) => {
        if (!token) {
            throw new Error('You must be logged in to delete an FAQ');
        }
        return storeDeleteFaq(faqId);
    }, [token, storeDeleteFaq]);

    // Registration Question Methods with authentication check
    const createRegistrationQuestion = useCallback(async (productId: string, data: Partial<RegistrationQuestion>) => {
        if (!token) {
            throw new Error('You must be logged in to create a registration question');
        }
        return storeCreateRegistrationQuestion(productId, data);
    }, [token, storeCreateRegistrationQuestion]);
    
    const getRegistrationQuestions = useCallback(async (productId: string) => {
        if (!token) {
            throw new Error('You must be logged in to get registration questions');
        }
        return storeGetRegistrationQuestions(productId);
    }, [token, storeGetRegistrationQuestions]);
    
    const updateRegistrationQuestion = useCallback(async (questionId: string, data: Partial<RegistrationQuestion>) => {
        if (!token) {
            throw new Error('You must be logged in to update a registration question');
        }
        return storeUpdateRegistrationQuestion(questionId, data);
    }, [token, storeUpdateRegistrationQuestion]);
    
    const deleteRegistrationQuestion = useCallback(async (questionId: string) => {
        if (!token) {
            throw new Error('You must be logged in to delete a registration question');
        }
        return storeDeleteRegistrationQuestion(questionId);
    }, [token, storeDeleteRegistrationQuestion]);

    // Support Detail Methods with authentication check
    const createSupportDetail = useCallback(async (productId: string, data: Partial<SupportDetail>) => {
        if (!token) {
            throw new Error('You must be logged in to create a support detail');
        }
        return storeCreateSupportDetail(productId, data);
    }, [token, storeCreateSupportDetail]);
    
    const getSupportDetails = useCallback(async (productId: string) => {
        if (!token) {
            throw new Error('You must be logged in to get support details');
        }
        return storeGetSupportDetails(productId);
    }, [token, storeGetSupportDetails]);
    
    const updateSupportDetail = useCallback(async (detailId: string, data: Partial<SupportDetail>) => {
        if (!token) {
            throw new Error('You must be logged in to update a support detail');
        }
        return storeUpdateSupportDetail(detailId, data);
    }, [token, storeUpdateSupportDetail]);
    
    const deleteSupportDetail = useCallback(async (detailId: string) => {
        if (!token) {
            throw new Error('You must be logged in to delete a support detail');
        }
        return storeDeleteSupportDetail(detailId);
    }, [token, storeDeleteSupportDetail]);

    // Cover Image Methods with authentication check
    const uploadCover = async (productId: string, file: File): Promise<string | null> => {
        try {
            console.log("uploadFile", productId, file);
            const mimeType = getFileType(file.type);
            if(mimeType !== "IMAGE"){
                throw new Error('File Type must be Image')
            }
            const { uploadUrl, s3Key } = await getUploadCoverUrl(
                productId, 
                file.name, 
                mimeType
            );
            
            // Step 2: Upload file to S3
            await uploadFileToS3(uploadUrl, file);

            // Step 3: Upload file to database
            await uploadCoverImage(productId, s3Key);
            
            // Return the cover image URL
            return await getCoverImage(productId);
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    };

    const getUploadCoverUrl = useCallback(async (productId: string, fileName: string, fileType: string) => {
        if (!token) {
            throw new Error('You must be logged in to get cover upload URL');
        }
        return storeGetUploadCoverUrl(productId, fileName, fileType);
    }, [token, storeGetUploadCoverUrl]);
    
    const uploadCoverImage = useCallback(async (productId: string, s3Key: string) => {
        if (!token) {
            throw new Error('You must be logged in to upload a cover image');
        }
        return storeUploadCoverImage(productId, s3Key);
    }, [token, storeUploadCoverImage]);
    
    const getCoverImage = useCallback(async (productId: string) => {
        return storeGetCoverImage(productId);
    }, [storeGetCoverImage]);


    const initiatePurchase = useCallback(async (productId: string, customAmount?: number) => {
        if (!token) {
          throw new Error('You must be logged in to subscribe to a plan');
        }
        return storeInitiatePurchase(productId, customAmount);
      }, [token, storeInitiatePurchase]);

    const handlePaymentCallback = useCallback(async (orderId: string, productType: string) => {
    if (!token) {
        throw new Error('You must be logged in to handle payment callback');
    }
    return storeHandlePaymentCallback(orderId, productType);
    }, [token, storeHandlePaymentCallback]);

    //Gallery Image Methods with authentication check
    const getUploadGalleryUrl = useCallback(async (productId: string, fileName: string, fileType: string) => {
        if (!token) {
            throw new Error('You must be logged in to get gallery upload URL');
        }
        return storeGetUploadGalleryUrl(productId, fileName, fileType);
    }, [token, storeGetUploadGalleryUrl]);  

    const uploadGalleryImage = useCallback(async (productId: string, s3Key: string) => {
        if (!token) {
            throw new Error('You must be logged in to upload a gallery image');
        }
        return storeUploadGalleryImage(productId, s3Key);
    }, [token, storeUploadGalleryImage]);   

    const uploadGallery = async (productId: string, file: File) => {
        try {
            console.log("uploadFile", productId, file);
            const mimeType = getFileType(file.type);
            if(mimeType !== "IMAGE"){
                throw new Error('File Type must be Image')  
            }
            const { uploadUrl, s3Key } = await getUploadGalleryUrl(
                productId,
                file.name,
                mimeType
            );

            // Step 2: Upload file to S3
            await uploadFileToS3(uploadUrl, file);

            // Step 3: Upload file to database
            await uploadGalleryImage(productId, s3Key);

            // Return the gallery image URL
            return await getGalleryImage(productId);
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }
    const getGalleryImage = useCallback(async (productId: string) => {
        try {
            const result = await storeGetGalleryImage(productId);
            return result;
        } catch (error) {
            // If the error is just "No gallery images found", return an empty array instead of throwing
            if (error instanceof Error && 
                (error.message.includes("No gallery images found") || 
                 (typeof error.message === 'string' && error.message.includes('"success":false,"message":"No gallery images found"')))) {
                console.log("No gallery images found, returning empty array");
                return [];
            }
            // For other errors, rethrow
            throw error;
        }
    }, [storeGetGalleryImage]);

    return {
        // State
        products,
        currentProduct,
        isLoading,
        error,
        
        // Product Methods
        createProduct,
        fetchProducts,
        fetchProductById,
        fetchPublicProductBySlug,
        updateProduct,
        deleteProduct,
        setCurrentProduct,
        publishProduct,
        unpublishProduct,
        
        // File Methods
        uploadFile,
        getFileUploadUrl,
        uploadFileToS3,
        uploadDigitalProductFile,
        getDigitalProductFiles,
        deleteFile,
        
        // Testimonial Methods
        createTestimonial,
        getTestimonials,
        updateTestimonial,
        deleteTestimonial,
        
        // FAQ Methods
        createFaq,
        getFaqs,
        updateFaq,
        deleteFaq,
        
        // Registration Question Methods
        createRegistrationQuestion,
        getRegistrationQuestions,
        updateRegistrationQuestion,
        deleteRegistrationQuestion,
        
        // Support Detail Methods
        createSupportDetail,
        getSupportDetails,
        updateSupportDetail,
        deleteSupportDetail,
        
        // Cover Image Methods
        uploadCover,
        getUploadCoverUrl,
        uploadCoverImage,
        getCoverImage,

        //payments
        initiatePurchase,
        handlePaymentCallback,

        //Gallery Image Methods
        uploadGallery,
        getUploadGalleryUrl,
        uploadGalleryImage,
        getGalleryImage
    };
};
