import { useState, useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import { IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import LoadingSpinner from "../ui/LoadingSpinner";

const ProfileEdit = ({ setOpenEditDialog }: { setOpenEditDialog: (open: boolean) => void }) => {
  const { 
    profile, 
    profilePictureUrl,
    coverPictureUrl,
    updateProfile, 
    uploadAndUpdateProfilePicture, 
    uploadAndUpdateCoverPicture 
  } = useProfile();
  
  const [name, setName] = useState(profile?.name);
  const [phone, setPhone] = useState(profile?.phone);
  const [location, setLocation] = useState(profile?.location);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // State for image previews
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Generate preview URLs when files are selected
  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(profileImage);
    } else {
      setProfilePreview(null);
    }
  }, [profileImage]);

  useEffect(() => {
    if (coverImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(coverImage);
    } else {
      setCoverPreview(null);
    }
  }, [coverImage]);

  const handleUpdateProfile = async () => {
    try {
      setIsUploading(true);
      
      // First update basic profile info
      await updateProfile({
        name,
        phone,
        location
      });
      
      // Then handle file uploads if files are selected
      const uploadPromises = [];
      
      if (profileImage) {
        uploadPromises.push(uploadAndUpdateProfilePicture(profileImage));
      }
      
      if (coverImage) {
        uploadPromises.push(uploadAndUpdateCoverPicture(coverImage));
      }
      
      // Wait for all uploads to complete
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }
      
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImage(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white w-1/2 rounded-3xl pb-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between sticky top-0 bg-white z-10">
            <h2 className="text-2xl p-6 py-8 border-b border-gray-200">Edit Profile</h2>
            <button onClick={() => setOpenEditDialog(false)} className="text-2xl p-6 py-8">
                <IoMdClose />
            </button>
        </div>
        
        {/* Cover Image Preview */}
        <div className="w-full h-48 bg-gray-100 mb-6 relative">
          {(coverPreview || coverPictureUrl) && (
            <img 
              src={coverPreview || coverPictureUrl || ''} 
              alt="Cover preview" 
              className="w-full h-48 object-cover"
            />
          )}
          {!coverPreview && !coverPictureUrl && (
            <div className="w-full h-48 flex flex-col items-center justify-center text-gray-400">
              <MdOutlinePhotoLibrary className="text-4xl mb-2" />
              <span>No cover image</span>
            </div>
          )}
          <label 
            htmlFor="coverImage" 
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-50"
          >
            <MdOutlinePhotoLibrary className="text-xl" />
          </label>
          <input 
            type="file" 
            id="coverImage" 
            onChange={handleCoverImageChange} 
            className="hidden" 
            accept="image/*"
          />
        </div>
        
        {/* Profile Image Preview */}
        <div className="flex justify-center -mt-16 mb-6 relative">
          <div className="w-32 h-32 rounded-full bg-white p-1 shadow-md">
            <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {(profilePreview || profilePictureUrl) ? (
                <img 
                  src={profilePreview || profilePictureUrl || ''} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FaUser className="text-4xl text-gray-400" />
              )}
            </div>
            <label 
              htmlFor="profileImage" 
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-50"
            >
              <FaUser className="text-sm" />
            </label>
            <input 
              type="file" 
              id="profileImage" 
              onChange={handleProfileImageChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
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