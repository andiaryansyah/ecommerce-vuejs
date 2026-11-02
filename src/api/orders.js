import axios from "./axios";

export const fetchOrders = async ({ search, status, date, page = 1 } = {}) => {
  const { data } = await axios.get("/admin/orders", {
    params: { search, status, date, page },
  });
  return data; // sekarang isinya { data, pagination, stats }
};

export const fetchOrderDetail = async (id) => {
  const { data } = await axios.get(`/admin/orders/${id}`);
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await axios.put(`/admin/orders/${id}/status`, { status });
  return data;
};

export const adminCancelOrder = async (id) => {
  const { data } = await axios.post(`/admin/orders/${id}/cancel`);
  return data;
};

export const userCancelOrder = async (id) => {
  const { data } = await axios.post(`/orders/${id}/cancel`);
  return data;
};
