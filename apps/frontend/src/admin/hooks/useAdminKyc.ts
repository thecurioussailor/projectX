import { useCallback, useEffect } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { AdminKycDocument, useAdminKycStore } from "../store/useAdminKycStore";

export const useAdminKyc = () => {
    const { token } = useAdminAuth();

    const { 
        kycDocument, 
        currentKycDocument, 
        isLoading, 
        error, 
        getAllKycDocuments: getAllKycDocumentsStore, 
        getKycDocumentById: getKycDocumentByIdStore, 
        updateKycDocument: updateKycDocumentStore 
    } = useAdminKycStore();

    const fetchAllKycDocuments = useCallback(async () => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return getAllKycDocumentsStore();
    }, [token, getAllKycDocumentsStore]);

    const fetchKycDocumentById = useCallback(async (id: string) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return getKycDocumentByIdStore(id);
    }, [token, getKycDocumentByIdStore]);

    const updateKycDocumentById = useCallback(async (id: string, document: AdminKycDocument) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return updateKycDocumentStore(id, document);
    }, [token, updateKycDocumentStore]);

    useEffect(() => {
        fetchAllKycDocuments();
    }, [fetchAllKycDocuments]);

    return { 
        kycDocument, 
        currentKycDocument, 
        isLoading,  
        error, 
        fetchAllKycDocuments, 
        fetchKycDocumentById, 
        updateKycDocumentById 
    };
};


