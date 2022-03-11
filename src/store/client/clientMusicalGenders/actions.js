import { api } from "boot/axios";

export const getMusicalGenders = async ({ commit }) => {
  await api.get("/api/client/musical-genders").then((response) => {
    commit("setMusicalGenders", response.data.musicalGenders);
  });
};