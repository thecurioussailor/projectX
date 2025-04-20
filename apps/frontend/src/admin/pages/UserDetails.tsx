import { useParams } from "react-router-dom";
import { useUserMnt } from "../hooks/useUserMnt";
import { useEffect } from "react";

const UserDetails = () => {
    const { id } = useParams();
    const { currentUser, fetchUserById } = useUserMnt();
    useEffect(() => {
        fetchUserById(Number(id));
    }, [id, fetchUserById]);
    
  return (
    <div>
    {currentUser?.username}
    </div>
  )
}

export default UserDetails