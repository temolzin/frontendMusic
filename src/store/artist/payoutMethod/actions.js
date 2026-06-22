import { api } from "boot/axios";

export const fetchPayoutMethod = async ({ commit }) => {
  try {
    const response = await api.get("/api/artist/payout-method");
    if (response.data && response.data.success) {
      commit("setPayoutData", response.data.data);
    }
  } catch (error) {
    console.error("Error fetching payout method:", error);
  }
};

export const savePayoutMethod = async ({ commit }, payload) => {
  try {
    const response = await api.post("/api/artist/payout-method", payload);
    if (response.data && response.data.success) {
      commit("setPayoutData", response.data.data);
      return response.data;
    }
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
