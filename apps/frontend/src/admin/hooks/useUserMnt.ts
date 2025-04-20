import { useCallback, useEffect } from "react";
import { useAdminAuth } from "../context/AdminAuthContext"
import { useUserMntStore } from "../store/useUserMntStore"
export const useUserMnt = () => {
    const { token } = useAdminAuth();
    
    const {
        users,
        currentUser,
        isLoading,
        error,
        fetchUsers: fetchUsersStore,
        fetchUserById: fetchUserByIdStore,
    } = useUserMntStore();

    const fetchAllUsers = useCallback(async () => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return fetchUsersStore();
    }, [token, fetchUsersStore]);

    const fetchUserById = useCallback(async (id: number) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return fetchUserByIdStore(id);
    }, [token, fetchUserByIdStore]);

    useEffect(() => {
        fetchAllUsers();
    }, [token, fetchAllUsers]);

    return {
        users,
        currentUser,
        isLoading,
        error,
        fetchAllUsers,
        fetchUserById,
    }
}