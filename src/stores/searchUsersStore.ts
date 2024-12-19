import { SearchUserData, User } from "@/types";
import { create } from "zustand";

type SearchUsersStore = {
  users: SearchUserData[] | null;
  setUsers: (users: SearchUserData[] | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useSearchUserStore = create<SearchUsersStore>()((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
