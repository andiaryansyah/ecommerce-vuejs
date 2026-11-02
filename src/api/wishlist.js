import api from "./axios";

export const wishlistByUser = {
  getAll: async () => {
    const { data } = await api.get("/wishlists");
    return { items: data.wishlists || [], count: data.count || 0 };
  },
  toggle: (productId) =>
    api.post("/wishlists/toggle", { product_id: productId }),
  remove: (id) => api.delete(`/wishlists/${id}`),
};
