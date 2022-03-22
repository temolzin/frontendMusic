import { api } from "boot/axios";

export const getMusicalGenders = async ({ commit }) => {
  await api.get("/api/client/musical-genders").then((response) => {
    commit("setMusicalGenders", response.data.musicalGenders);
  });
};

export const getMusicalGendersBySlug = async ({ commit }, slug) => {
  await api.get(`/api/client/musical-genders/${slug}`).then((response) => {
    commit("setArtistsGenders", response.data.artistsGenders);
  });
};

export const getArtistBySlug = async ({ commit }, slug) => {
  await api.get(`/api/client/musical-genders/artist/${slug}`).then((response) => {
    commit("setArtistGender", response.data.artistGender);
  });
};