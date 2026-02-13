// import { create } from "zustand";
// import { postLogin } from "../apis/loginApi";
// import { useProfileStore } from "./profileStore";
// import { persist } from "zustand/middleware";
// import type { ProfileType } from "../types/common";

// interface AuthState {
//   isLoggedIn: boolean;
//   login: (userId: string, password: string) => Promise<"success" | "fail">;
//   clearAuth: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       isLoggedIn: false,

//       login: async (userId: string, password: string) => {
//         const result = await postLogin(userId, password, "");
//         if (result !== undefined && "message" in result) {
//           return "fail";
//         }
//         useProfileStore.getState().setProfile(() => result as ProfileType);
//         set({ isLoggedIn: true });
//         sessionStorage.setItem("initialLoadDone", "true");
//         return "success";
//       },
//       clearAuth: () => {
//         set({ isLoggedIn: false });
//         useProfileStore.getState().setProfile(() => ({
//           userId: 0,
//           email: "",
//           nickname: "",
//           token: "",
//         }));
//         sessionStorage.removeItem("initialLoadDone");
//       },
//     }),
//     {
//       name: "auth-storage",
//     }
//   )
// );
