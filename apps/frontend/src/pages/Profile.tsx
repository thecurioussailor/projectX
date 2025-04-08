import { useState } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { useProfile } from "../hooks/useProfile"
import { GrEdit } from "react-icons/gr";
import ProfileEdit from "../components/profile/ProfileEdit";
import { FaUser } from "react-icons/fa";
import { MdOutlinePhotoLibrary } from "react-icons/md";

const Profile = () => {
  const { profile, isLoading, error, profilePictureUrl, coverPictureUrl } = useProfile();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-72px)]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-72px)]">
        <p className="text-red-500">Error loading profile: {error}</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-72px)]">
        <p>No profile data available</p>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#7F37D8]"> Profile </h1>
      </div>
      <div className="flex relative justify-between">
        <div className="w-full h-96 rounded-t-lg bg-gray-100 flex items-center justify-center">
          {coverPictureUrl ? (
            <img 
              src={coverPictureUrl} 
              alt="Cover" 
              className="w-full h-96 rounded-t-lg object-cover object-center" 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = ''; // Clear the broken image
                e.currentTarget.classList.add('hidden');
                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-100');
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <MdOutlinePhotoLibrary className="text-6xl mb-2" />
              <span className="text-sm">No cover image</span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 p-2 bg-white rounded-full w-36 h-36 flex items-center justify-center">
          {profilePictureUrl ? (
            <img 
              src={profilePictureUrl} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover" 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '';
                e.currentTarget.classList.add('hidden');
                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-100');
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <FaUser className="text-4xl" />
            </div>
          )}
        </div>
        <button 
          onClick={() => setOpenEditDialog(true)}
          className="absolute -bottom-[30px] left-1/2 translate-x-1/2 flex flex-col items-center rounded-full bg-white p-2 shadow-md hover:bg-gray-50">
          <GrEdit className="text-2xl" />
        </button>
        {openEditDialog && <ProfileEdit setOpenEditDialog={setOpenEditDialog} />}
        <div className="absolute -bottom-[84px] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-[#7F37D8]">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.role}</p>
        </div>
      </div>
      <div className="flex justify-between gap-4 pt-6 pb-12 px-6 border-b border-[#E0E0E0]">
        <div className="flex gap-4">
          <div>
            <h3 className="text-xs text-[#898989]">Email</h3>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
          <div>
            <h3 className="text-xs text-[#898989]">Phone</h3>
            <p className="text-sm text-gray-500">{profile.phone || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <h3 className="text-xs text-[#898989]">Contact</h3>
            <p className="text-sm text-gray-500">{profile.phone || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-xs text-[#898989]">Location</h3>
            <p className="text-sm text-gray-500">{profile.location || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile