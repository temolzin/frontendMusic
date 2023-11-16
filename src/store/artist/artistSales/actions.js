import { api } from "boot/axios";

export const getArtistSalesById = async ({ commit }, artistId) => {
  await api.get(`/api/artistSales/${artistId}`).then((response) => {
    commit("setArtistSales", response.data.artistSales);
  });
};