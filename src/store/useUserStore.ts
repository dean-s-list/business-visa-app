import { create } from "zustand";

interface UserState {
    isSigningIn: boolean;
    setIsSigningIn: (isSigningIn: boolean) => void;
}

const useUserStore = create<UserState>()((set) => ({
    isSigningIn: false,
    setIsSigningIn: (isSigningIn: boolean) => set({ isSigningIn }),
}));

export default useUserStore;
