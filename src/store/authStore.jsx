import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null, // Load user from localStorage
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user)); // Save to localStorage
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("user"); // Remove from localStorage
    set({ user: null });
  },
}));

export default useAuthStore;
