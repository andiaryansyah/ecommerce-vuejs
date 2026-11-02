import api from "./axios";

export const loginApi = async (credentials) => {
  const res = await api.post("/login", credentials);
  return res.data;
};

export const registerApi = async (payload) => {
  const res = await api.post("/register", payload);
  return res.data;
};

export const fetchMeApi = async () => {
  const res = await api.get("/me");
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post("/logout");
  return res.data;
};
