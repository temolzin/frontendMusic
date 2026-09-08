import { api } from "boot/axios";

export const getMusicalGenders = async ({ commit }) => {
  await api.get("/api/admin/musical-genders").then((response) => {
    commit("setMusicalGenders", response.data.musicalGenders);
  });
};

export const createMusicalGender = async ({ dispatch }, payload) => {
  await api.post("/api/admin/musical-genders", payload, {
    headers: { "content-type": "multipart/form-data" },
  }).then((response) => {
    dispatch("getMusicalGenders");
  });
};

export const deleteMusicalGender = async ({ dispatch }, id) => {
  await api.delete(`/api/admin/musical-genders/${id}`).then((response) => {
    dispatch("getMusicalGenders");
  });
};

export const updateMusicalGender = async ({ dispatch }, { id, form }) => {
  await api.post(`/api/admin/musical-genders/${id}`, form, {
    headers: { "content-type": "multipart/form-data" },
  }).then((response) => {
    dispatch("getMusicalGenders");
  });
};
