import { User } from "@/app/model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: User | null;
  hasHydrated: boolean; 
  setHasHydrated: (state: boolean) => void;
  setUser: (user: User) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
      setUser: (user: User) => set({ user }),
      clear: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
