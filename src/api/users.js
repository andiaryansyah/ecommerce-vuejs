import axios from "../api/axios";

export const fetchCustomers = async (params = {}) => {
  const res = await axios.get("/admin/users", { params });
  return res.data;
};
