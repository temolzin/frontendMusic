import { api } from "boot/axios";

export const getArtistSales = async ({ commit }) => {
  await api.get("/api/artist-sales").then((response) => {
    commit("setArtistSales", response.data.sales);
  });
};