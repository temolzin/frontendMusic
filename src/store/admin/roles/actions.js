import { api } from "boot/axios";

export const getRoles = async ({ commit }) => {
  await api.get("/api/admin/roles").then((response) => {
    commit("setRoles", response.data.roles);
  });
};

export const createRole = async ({ dispatch }, payload) => {
  await api.post("/api/admin/roles", payload).then((response) => {
    dispatch("getRoles");
  });
};

export const deleteRole = async ({ dispatch }, id) => {
  await api.delete(`/api/admin/roles/${id}`).then((response) => {
    dispatch("getRoles");
  });
};

export const updateRole = async ({ dispatch }, form) => {
  await api.put(`/api/admin/roles/${form.id}`, form).then((response) => {
    dispatch("getRoles");
  });
};


export const getPermissions = async ({ commit }) => {
  await api.get("/api/admin/permissions").then((response) => {
    commit("setPermissions", response.data.permissions);
  });
};