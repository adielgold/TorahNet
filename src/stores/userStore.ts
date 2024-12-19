import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  user: (User & { token: string }) | null;
  setUser: (user: (User & { token: string }) | null) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user_storage",
      getStorage: () => localStorage,
    }
  )
);
