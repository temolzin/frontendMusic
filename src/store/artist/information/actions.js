import { api } from "boot/axios";

export const getArtist = async ({ commit }) => {
  await api.get("/api/artist-new").then((response) => {
    commit("setArtist", response.data.artists);
    commit("setLatestRequest", response.data.latestRequest);
  });
};

export const createArtist = async ({ dispatch }, payload) => {
  const { data } = await api.post("/api/artist-new", payload,
  {headers : {'content-type': 'multipart/form-data'}});
  return data;
};

export const updateArtist = async ({ dispatch }, formUpdate) => {
  const { data } = await api.post(`/api/artist-new/up-date/${formUpdate.id}`, formUpdate.form,
  {headers : {'content-type': 'multipart/form-data'}});
  return data;
};
