import { create } from "zustand";

interface AppStates {
  openModal: boolean;
  setOpenModal: (bool: boolean) => void;
}

const useAppStore = create<AppStates>((set, get) => ({
  openModal: false,
  setOpenModal: (bool: boolean) => {
    set({ openModal: bool });
  },
}));

export default useAppStore;
