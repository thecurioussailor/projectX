import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { IoMdClose } from "react-icons/io";
import LoadingSpinner from "../ui/LoadingSpinner";
import UploadCoverPicture from "./UploadCoverPicture";
import UploadProfilePicture from "./UploadProfilePicture";

const ProfileEdit = ({ setOpenEditDialog }: { setOpenEditDialog: (open: boolean) => void }) => {
  const { 
    profile, 
    updateProfile, 
  } = useProfile();
  
  const [name, setName] = useState(profile?.name);
  const [phone, setPhone] = useState(profile?.phone);
  const [location, setLocation] = useState(profile?.location);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      setIsUploading(true);
      
      // First update basic profile info
      await updateProfile({
        name,
        phone,
        location
      });
      
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-2">
      <div className="bg-white w-full md:w-2/3 lg:w-1/2 rounded-3xl pb-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between sticky top-0 bg-white z-10">
            <h2 className="text-2xl p-6 py-8 border-b border-gray-200">Edit Profile</h2>
            <button onClick={() => setOpenEditDialog(false)} className="text-2xl p-6 py-8">
                <IoMdClose />
            </button>
        </div>
      
        <div className="flex flex-wrap gap-4 p-6">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-100 rounded-3xl p-2 outline-none px-4" />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-[calc(50%-0.5rem)]">
            <label htmlFor="phone">Phone Number</label>
            <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-gray-100 rounded-3xl p-2 outline-none px-4" />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-[calc(50%-0.5rem)]">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="border border-gray-100 rounded-3xl p-2 outline-none px-4" />
          </div>
        </div>
        
        <div className="p-6 gap-4 flex flex-col">
          <UploadCoverPicture />
          <UploadProfilePicture />
        </div>
        
        <div className="flex justify-end p-6">
          <button 
            onClick={handleUpdateProfile}
            disabled={isUploading}
            className="bg-[#7e57c2] text-white px-4 py-2 rounded-3xl w-40 disabled:bg-gray-400 flex items-center justify-center">
            {isUploading ? (
              <>
                <LoadingSpinner size="sm" color="#fff" />
                <span className="ml-2">Updating...</span>
              </>
            ) : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileEdit