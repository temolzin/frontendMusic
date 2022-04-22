import { api } from "boot/axios";

export const getProducts = async ({ commit }) => {
  await api.get("/api/product").then((response) => {
    commit("setProducts", response.data.products);
  });
};

export const createProduct = async ({ dispatch }, payload) => {
  await api.post("/api/product", payload).then((response) => {
    dispatch("getProducts");
  });
};

export const deleteProduct = async ({ dispatch }, id) => {
  await api.delete(`/api/product/${id}`).then((response) => {
    dispatch("getProducts");
    return response.data;
  });
};

export const editProduct = async ({ commit }, id) => {
  await api.get(`/api/product/${id}`).then((response) => {
    commit("setProduct", response.data);
    //dispatch("getProducts");
  });
};

export const updateProduct = async ({ dispatch }, note) => {
  await api.put(`/api/product/${note.id}/`, note.form).then((response) => {
    dispatch("getProducts");
  });
};
