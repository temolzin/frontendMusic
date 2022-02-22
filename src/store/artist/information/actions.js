import { api } from "boot/axios";

export const getArtist = async ({ commit }) => {
  await api.get("/api/artist-new").then((response) => {
    commit("setArtist", response.data.artists);
  });
};

export const createArtist = async ({ dispatch }, payload) => {
  await api.post("/api/artist-new", payload).then((response) => {
    //dispatch("getArtist");
  });
};

// export const deleteArtist = async ({ dispatch }, id) => {
//   await api.delete(`/api/artist-new/${id}`).then((response) => {
//     dispatch("getArtist");
//   });
// };

export const updateArtist = async ({ dispatch }, formCreate) => {
  await api.put(`/api/artist-new/${formCreate.id}`, formCreate).then((response) => {
    //dispatch("getArtist");
  });
};
