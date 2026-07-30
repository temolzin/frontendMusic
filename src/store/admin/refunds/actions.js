import { api } from "boot/axios";

export const fetchRefunds = async ({ commit }) => {
  try {
    const response = await api.get("/api/admin/client-refunds");
    commit("setRefunds", response.data);
  } catch (error) {
    console.error("Error al obtener devoluciones de clientes:", error);
    throw error;
  }
};

export const processClientRefund = async ({ dispatch }, refundId) => {
  try {
    await api.post(`/api/admin/client-refunds/${refundId}/process`);
    dispatch("fetchRefunds");
  } catch (error) {
    console.error(`Error al procesar reembolso #${refundId}:`, error);
    throw error;
  }
};
