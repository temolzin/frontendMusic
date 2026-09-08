import { api } from "boot/axios";

export const getArtistSales = async ({ commit }) => {
  await api.get("/api/artist/sales/details").then((response) => {
    commit("setArtistSales", response.data.sales || []);
  });
};

export const cancelArtistSale = async ({ dispatch }, { id, reason }) => {
  await api.post(`/api/artist/sales/${id}/cancel`, { reason });
  dispatch("getArtistSales");
};
