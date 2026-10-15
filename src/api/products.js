import api from "./axios";

// ------------------------- PRODUCT API ----------------------------

export const getProducts = async () => {
  const res = await api.get("/products", {
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  return res.data;
};
export const getProductById = (id) =>
  api.get(`/products/${id}`).then((res) => res.data);

export const createProduct = async (formData) => {
  const res = await api.post("/admin/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "ngrok-skip-browser-warning": "true",
    },
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  // Laravel butuh _method PUT kalau pakai FormData
  formData.append("_method", "PUT");
  const res = await api.post(`/admin/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "ngrok-skip-browser-warning": "true",
    },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/admin/products/${id}`, {
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  return res.data;
};

// ------------------------- CATEGORY API ----------------------------

export const getCategories = async () => {
  const res = await api.get("/admin/categories", {
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  return Array.isArray(res.data) ? res.data : res.data.data;
};

export const createCategory = async (data) => {
  // data = { name: string, parent_id: number | null }
  const res = await api.post("/admin/categories", data, {
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  return res.data.data || res.data;
};

export const updateCategory = async (id, data) => {
  const res = await api.put(`/admin/categories/${id}`, data, {
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  return res.data.data || res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/admin/categories/${id}`, {
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  return res.data;
};
