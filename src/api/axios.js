import axios from "axios";

const apiUrl =
  import.meta.env.VITE_API_URL ||
  "https://strudel-elude-umpire.ngrok-free.dev/api";

const isNgrok =
  apiUrl.includes("ngrok-free.dev") || apiUrl.includes("ngrok.io");

const api = axios.create({
  baseURL: apiUrl,
  timeout: 60000,
  headers: {
    Accept: "application/json",
    ...(isNgrok && { "ngrok-skip-browser-warning": "true" }),
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // jangan pakai window.location biar gak full reload
      // nanti pakai router.push('/login') di store
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
