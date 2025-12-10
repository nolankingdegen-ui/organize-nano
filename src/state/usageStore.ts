import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UsageStore {
  transformationsUsed: number;
  isPremium: boolean;
  userId: string | null;
  incrementUsage: () => void;
  resetUsage: () => void;
  setUserId: (userId: string | null) => void;
  setPremium: (premium: boolean) => void;
  canUseTransformation: () => boolean;
}

export const useUsageStore = create<UsageStore>()(
  persist(
    (set, get) => ({
      transformationsUsed: 0,
      isPremium: false,
      userId: null,

      incrementUsage: () =>
        set((state) => ({
          transformationsUsed: state.transformationsUsed + 1,
        })),

      resetUsage: () => set({ transformationsUsed: 0 }),

      setUserId: (userId) => set({ userId }),

      setPremium: (premium) => set({ isPremium: premium }),

      canUseTransformation: () => {
        const state = get();
        // Premium users have unlimited access
        if (state.isPremium) return true;
        // Free users get 1 free transformation
        return state.transformationsUsed < 1;
      },
    }),
    {
      name: "usage-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
