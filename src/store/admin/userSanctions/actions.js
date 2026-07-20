import { api } from "boot/axios";

export const getUserSanctions = async ({ commit }) => {
  await api.get("/api/admin/user-sanctions").then((response) => {
    commit("setUserSanctions", response.data.data || []);
  });
};

export const applySanction = async ({ dispatch }, payload) => {
  await api.post("/api/admin/user-sanctions", payload);
  dispatch("getUserSanctions");
};

export const revokeSanction = async ({ dispatch }, id) => {
  await api.put(`/api/admin/user-sanctions/${id}/revoke`);
  dispatch("getUserSanctions");
};

export const getUserTickets = async ({ commit }, userId) => {
  try {
    const response = await api.get(`/api/admin/user-sanctions/${userId}/tickets`);
    commit("setUserTickets", response.data.tickets || []);
  } catch (error) {
    console.error("Error al obtener tickets", error);
    commit("setUserTickets", []);
  }
};

export const getUserHistoryAction = async (_, userId) => {
  try {
    const response = await api.get(`/api/admin/user-sanctions/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el historial del usuario", error);
    throw error;
  }
};
