import { api } from "boot/axios";

export const getArtist = async ({ commit }) => {
  await api.get("/api/artist-new").then((response) => {
    commit("setArtist", response.data.artists);
  });
};

export const createArtist = async ({ dispatch }, payload) => {
  await api.post("/api/artist-new", payload,
  {headers : {'content-type': 'multipart/form-data'}}).then((response) => {
    //dispatch("getArtist");
  });
};

export const updateArtist = async ({ dispatch }, formUpdate) => {
  await api.post(`/api/artist-new/up-date/${formUpdate.id}`, formUpdate.form,
  {headers : {'content-type': 'multipart/form-data'}}).then((response) => {
    //dispatch("getArtist");
  });
};
