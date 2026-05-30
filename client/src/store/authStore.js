import { create } from "zustand";

const AUTH_STORAGE_KEY = "mensShopAuth";

const getIsAdmin = (user) => user?.role === "admin";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAdmin: false,
  hasLoaded: false,
  login: (userData, token) => {
    const authData = { user: userData, token };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    localStorage.setItem("mensShopUser", JSON.stringify({ ...userData, token }));

    set({
      user: userData,
      token,
      isAdmin: getIsAdmin(userData),
      hasLoaded: true
    });
  },
  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("mensShopUser");

    set({
      user: null,
      token: null,
      isAdmin: false,
      hasLoaded: true
    });
  },
  updateUser: (updates) => {
    set((state) => {
      if (!state.user) {
        return state;
      }

      const user = { ...state.user, ...updates };
      const authData = { user, token: state.token };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      localStorage.setItem("mensShopUser", JSON.stringify({ ...user, token: state.token }));

      return {
        user,
        isAdmin: getIsAdmin(user)
      };
    });
  },
  loadUser: () => {
    const storedAuth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    const legacyUser = JSON.parse(localStorage.getItem("mensShopUser") || "null");

    if (storedAuth?.user && storedAuth?.token) {
      set({
        user: storedAuth.user,
        token: storedAuth.token,
        isAdmin: getIsAdmin(storedAuth.user),
        hasLoaded: true
      });
      return;
    }

    if (legacyUser?.token) {
      const { token, ...user } = legacyUser;

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
      set({
        user,
        token,
        isAdmin: getIsAdmin(user),
        hasLoaded: true
      });
      return;
    }

    set({ hasLoaded: true });
  }
}));

export default useAuthStore;
