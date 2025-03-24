import { create } from 'zustand';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// Define profile interface
export interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  contact: string;
  location: string;
  coverImage: string; 
  profileImage: string;
}

// Define store state interface
interface ProfileState {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
}

// Create profile store
export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  // Fetch profile data
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${BACKEND_URL}/api/v1/users/me`);
      const data = await response.json();
      
      
      set({ profile: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
    }
  },

  // Update profile data
  updateProfile: async (data: Partial<ProfileData>) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const updatedData = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state with new data (merging with existing data)
      set(state => ({
        profile: state.profile ? { ...state.profile, ...data } : null,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
    }
  }
})); 