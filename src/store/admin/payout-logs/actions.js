import { api } from "boot/axios";

export const fetchPayoutHistory = async ({ commit }) => {
  commit("SET_LOADING_HISTORY", true);

  try {
    const response = await api.get("/api/admin/payouts/history");
    commit("SET_LOGS", response.data.data || []);
  } catch (error) {
    console.error("Error al obtener el historial de liquidaciones:", error);
    throw error;
  } finally {
    commit("SET_LOADING_HISTORY", false);
  }
};
