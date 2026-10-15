import axios from "axios";

const api = axios.create({
  baseURL: "https://strudel-elude-umpire.ngrok-free.dev/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true", // WAJIB, ini yang bikin kamu error tadi
  },
});

// 1. Auto pasang Token Sanctum setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // atau sessionStorage
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
