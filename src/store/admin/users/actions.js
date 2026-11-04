import { api } from "boot/axios";

export const getUsers = async ({ commit }) => {
  const response = await api.get("/api/admin/users");
  const users = response.data && response.data.users;

  if (!Array.isArray(users)) {
    throw new Error("La respuesta de usuarios no tiene el formato esperado.");
  }

  commit("setUsers", users);
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
