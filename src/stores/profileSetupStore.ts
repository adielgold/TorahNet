import { ProfileSetupTypeStudent } from "@/lib/types";
import { create } from "zustand";

type ProfileSetupStore = {
  profileSetup: ProfileSetupTypeStudent;
  setProfileSetup: (profileSetup: ProfileSetupTypeStudent) => void;
};

export const useProfileSetupStore = create<ProfileSetupStore>((set) => ({
  profileSetup: {
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    topics: [],
    bio: "",
    country: "",
  },
  setProfileSetup: (profileSetup) => set({ profileSetup }),
}));
