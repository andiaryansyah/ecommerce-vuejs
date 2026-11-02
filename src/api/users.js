import axios from "./axios";

// ADMIN
export const fetchCustomers = async (params = {}) => {
  const res = await axios.get("/admin/users", { params });
  return res.data;
};

// USER PROFILE (ACCOUNT)
export const fetchProfile = async () => {
  const res = await axios.get("/user");
  return res.data;
};

export const updateProfile = async (formData) => {
  const res = await axios.post("/user/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const changePassword = async (payload) => {
  const res = await axios.post("/user/change-password", payload);
  return res.data;
};

// PURCHASE / ORDERS
export const fetchPurchases = async (params = {}) => {
  const res = await axios.get("/user/purchases", { params });
  return res.data;
};

export const fetchPurchaseDetail = async (id) => {
  const res = await axios.get(`/user/purchases/${id}`);
  return res.data;
};
