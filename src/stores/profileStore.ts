import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileType } from "../types/common";

interface ProfileStore {
  profile: ProfileType;
  setProfile: (updater: (value: ProfileType) => ProfileType) => void;
}
export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: {
        userId: 0,
        email: "",
        nickname: "이채영",
        token: "",
      },
      setProfile: (updater) =>
        set((state) => ({ profile: updater(state.profile) })),
    }),
    {
      name: "profile-storage",
    }
  )
);
