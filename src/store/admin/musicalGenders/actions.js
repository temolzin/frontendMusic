import { api } from "boot/axios";

export const getMusicalGenders = async ({ commit }) => {
  await api.get("/api/admin/musical-genders").then((response) => {
    commit("setMusicalGenders", response.data.musicalGenders);
  });
};

export const createMusicalGender = async ({ dispatch }, payload) => {
  await api.post("/api/admin/musical-genders", payload).then((response) => {
    dispatch("getMusicalGenders");
  });
};

export const deleteMusicalGender = async ({ dispatch }, id) => {
  await api.delete(`/api/admin/musical-genders/${id}`).then((response) => {
    dispatch("getMusicalGenders");
  });
};

export const updateMusicalGender = async ({ dispatch }, form) => {
  await api
    .put(`/api/admin/musical-genders/${form.id}`, form)
    .then((response) => {
      dispatch("getMusicalGenders");
    });
};
