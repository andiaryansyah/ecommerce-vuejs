import { defineStore } from "pinia";
import { ref } from "vue";
import { loginApi, registerApi, fetchMeApi, logoutApi } from "../api/auth";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));
  const token = ref(localStorage.getItem("token") || null);
  const loading = ref(false);

  const setAuth = (data) => {
    const newToken = data.token || data.access_token;
    const newUser = data.user;

    token.value = newToken;
    user.value = newUser;

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const login = async (credentials) => {
    loading.value = true;
    try {
      const data = await loginApi(credentials);
      setAuth(data);
      await router.push("/");
      return data;
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload) => {
    loading.value = true;
    try {
      const data = await registerApi(payload);
      setAuth(data);
      await router.push("/");
      return data;
    } finally {
      loading.value = false;
    }
  };

  const fetchUser = async () => {
    try {
      const data = await fetchMeApi();
      user.value = data;
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch {
      logout();
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {}
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return { user, token, loading, login, register, fetchUser, logout, setAuth };
});
