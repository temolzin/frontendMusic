import { api } from "boot/axios";

export const getArtists = async ({ commit }) => {
  await api.get("/api/artist/getArtist").then((response) => {
    commit("setArtist", response.data.artists);
  });
};
