import { api } from "boot/axios";

export const getLatestArtists = async ({ commit }) => {
  await api.get("/api/latest-artists").then((response) => {
    commit("setArtists", response.data.latestArtists);
  });
};