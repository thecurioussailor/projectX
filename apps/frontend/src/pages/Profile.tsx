import { useProfile } from "../hooks/useProfile"

// Simple inline loading spinner component to avoid import issues
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div
      className="w-8 h-8 animate-spin rounded-full border-4 border-solid border-t-transparent"
      style={{ borderColor: '#7F37D8 transparent transparent transparent' }}
      role="status"
      aria-label="loading"
    />
  </div>
);

const Profile = () => {
  const { profile, isLoading, error } = useProfile()

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
        <div className="w-full h-96 rounded-t-lg">
          <img src={profile.coverImage} alt="cover" className="w-full h-96 rounded-t-lg object-cover object-center" />
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 p-2 bg-white rounded-full">
          <img src={profile.profileImage} alt="profile" className="w-32 h-32 rounded-full" />
        </div>
        <div className="absolute -bottom-[84px] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-[#7F37D8]">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.title}</p>
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
            <p className="text-sm text-gray-500">{profile.phone}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <h3 className="text-xs text-[#898989]">Contact</h3>
            <p className="text-sm text-gray-500">{profile.contact}</p>
          </div>
          <div>
            <h3 className="text-xs text-[#898989]">Location</h3>
            <p className="text-sm text-gray-500">{profile.location}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile