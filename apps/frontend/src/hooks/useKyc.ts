import { useCallback, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useKycStore } from "../store/useKycStore";

// Define file type mapping
const FileType = {
    PDF: "PDF",
    OTHER: "OTHER"
};

// Helper function to determine file type
const getFileType = (mimeType: string): string => {
    if (mimeType === "application/pdf") return FileType.PDF;
    return FileType.OTHER;
};

// Export as function declaration with explicit return type
export function useKyc(autoFetch: boolean = true) {

    const { token } = useAuthStore();   

    const {
        kycDocument,
        isLoading,
        error,
        getUploadKycUrl: getUploadKycUrlStore,
        uploadKycDocument: uploadKycDocumentStore,
        getKycDocument: getKycDocumentStore
    } = useKycStore();

       

    const uploadDocument = useCallback(async (file: File, documentType: string, documentNumber: string) => {
        if (!token) {
            throw new Error("You must be logged in to upload KYC documents");
        }
        try {
            // Validate file type (must be PDF)
            if (getFileType(file.type) !== FileType.PDF) {
                throw new Error('Only PDF files are allowed for KYC documents');
            }
            // Step 1: Get the upload URL
            const response = await getUploadKycUrlStore(documentType, documentNumber, file.name);
      
            if (!response || !response.success) {
                throw new Error('Failed to get upload URL');
            }

            const { uploadUrl, s3Key } = response.data;

            // Step 2: Upload the file to S3 using the presigned URL
            await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                'Content-Type': file.type,
                },
            });

            // Step 3: Confirm the upload with backend
            const { success, message } = await uploadKycDocumentStore(
                documentType, 
                documentNumber, 
                file.name, 
                s3Key
            );

            if (!success) {
                throw new Error(message || 'Failed to upload document');
            }
            await getDocument();

            return true;
        } catch (error) {
            console.error("Error uploading KYC document:", error);
            return false;
        }
    }, [token, getUploadKycUrlStore, uploadKycDocumentStore]);

    const getDocument = useCallback(async () => {
        if (!token) {
            throw new Error("You must be logged in to get KYC documents");
        }
        try {
            const response = await getKycDocumentStore();
            return response;
        } catch (error) {
            console.error("Error getting KYC document:", error);
            return null;
        }
    }, [token, getKycDocumentStore]);

    useEffect(() => {
        if (autoFetch && token) {
          getDocument();
        }
    }, [autoFetch, token, getDocument]);
    
    return {
        kycDocument,
        isLoading,
        error,
        uploadDocument,
        getDocument
    };
}
