import { api } from "boot/axios";

export const fetchPendingPayouts = async ({ commit }) => {
  try {
    const response = await api.get("/api/admin/payouts/pending");
    commit("setPendingPayouts", response.data.data);
  } catch (error) {
    console.error("Error al obtener liquidaciones pendientes:", error);
    throw error;
  }
};

export const releasePayout = async ({ dispatch }, saleId) => {
  try {
    await api.post(`/api/admin/payouts/${saleId}/release`);
    dispatch("fetchPendingPayouts");
  } catch (error) {
    console.error(`Error al liberar el pago #${saleId}:`, error);
    throw error;
  }
};
