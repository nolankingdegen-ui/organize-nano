import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RoomOrganization {
  id: string;
  originalImageUri: string;
  organizedImageUri: string;
  instructions: string[];
  timestamp: number;
  categoryId: string;
}

interface RoomStore {
  organizations: RoomOrganization[];
  addOrganization: (organization: RoomOrganization) => void;
  clearHistory: () => void;
}

export const useRoomStore = create<RoomStore>()(
  persist(
    (set) => ({
      organizations: [],
      addOrganization: (organization) =>
        set((state) => ({
          organizations: [organization, ...state.organizations],
        })),
      clearHistory: () => set({ organizations: [] }),
    }),
    {
      name: "room-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
