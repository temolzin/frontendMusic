import { api } from "boot/axios";

export const getUsers = async ({ commit }) => {
  await api.get("/api/admin/users").then((response) => {
    commit("setUsers", response.data.users);
  });
};

export const createUser = async ({ dispatch }, payload) => {
  await api.post("/api/admin/users", payload).then((response) => {
    dispatch("getUsers");
  });
};

export const deleteUser = async ({ dispatch }, id) => {
  await api.delete(`/api/admin/users/${id}`).then((response) => {
    dispatch("getUsers");
  });
};

export const updateUser = async ({ dispatch }, form) => {
  await api.put(`/api/admin/users/${form.id}`, form).then((response) => {
    dispatch("getUsers");
  });
};
