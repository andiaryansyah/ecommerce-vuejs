import api from "./axios";

export const cartByUser = {
  getAll: async () => {
    const { data } = await api.get("/carts");
    return {
      items: data.carts || [],
      count: data.carts?.length || 0, // distinct
      total: data.total_price || 0,
    };
  },
  add: (productId, size = null, qty = 1) =>
    api.post("/carts", { product_id: productId, size, quantity: qty }),
  updateQty: (cartId, qty) => api.put(`/carts/${cartId}`, { quantity: qty }),
  updateSize: (cartId, size) => api.put(`/carts/${cartId}`, { size }),
  remove: (cartId) => api.delete(`/carts/${cartId}`),
};
