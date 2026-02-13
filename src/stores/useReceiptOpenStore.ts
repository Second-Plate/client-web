import { create } from "zustand";

interface ReceiptOpenState {
  openUser: string | null;
  setOpenUser: (user: string | null) => void;
}

export const useReceiptOpenStore = create<ReceiptOpenState>((set) => ({
  openUser: null,
  setOpenUser: (user) => set({ openUser: user }),
}));
