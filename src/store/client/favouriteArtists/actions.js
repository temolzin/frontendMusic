import { api } from "boot/axios";

export const getFavouriteArtists = async ({ commit }) => {
  await api.get("/api/client/favourite_artists/list").then((response) => {
    commit("setFavouriteArtists", response.data.client);
  });
};

export const createFavouriteArtist = async ({ dispatch,commit }, payload) => {
  await api.post("/api/client/favourite_artists/new", payload).then((response) => {
    //dispatch("getFavouriteArtists");
    commit("setMessage", response.data.message);
  });
};

export const deleteFavouriteArtist = async ({ dispatch }, id) => {
  await api.delete(`/api/client/favourite_artists/destroy/${id}`).then((response) => {
    dispatch("getFavouriteArtists");
  });
};
