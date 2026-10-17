import axios from "axios";

const apiUrl =
  import.meta.env.VITE_API_URL ||
  "https://strudel-elude-umpire.ngrok-free.dev/api";

// cek ngrok
const isNgrok =
  apiUrl.includes("ngrok-free.dev") || apiUrl.includes("ngrok.io");

const api = axios.create({
  baseURL: apiUrl,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(isNgrok && { "ngrok-skip-browser-warning": "true" }),
  },
});

// 1. Auto pasang Token Sanctum setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Auto handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
