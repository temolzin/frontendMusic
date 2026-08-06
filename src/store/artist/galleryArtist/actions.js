import { api } from "boot/axios";

export const getGalleryArtist = async ({ commit }) => {
  const response = await api.get("/api/artist-new/gallery");
  commit("setGalleryArtist", response.data.artistGallery);
};

export const createGalleryArtist = async ({ dispatch }, payload) => {
  await api.post("/api/artist-new/gallery-artist", payload,
  {headers : {'content-type': 'multipart/form-data'}});
  await dispatch("getGalleryArtist");
};

export const upDateGalleryArtist = async ({ dispatch }, payload) => {
  await api.post("/api/artist-new/gallery-artist-update", payload,
  {headers : {'content-type': 'multipart/form-data'}});
  await dispatch("getGalleryArtist");
};

export const deleteGalleryArtist = async ({ dispatch }, payload) => {
  const dataToSend = typeof payload === 'object' ? payload : { media_id: payload };
  await api.delete('/api/artist-new/gallery-artist-delete', {
    data: dataToSend
  });
  await dispatch("getGalleryArtist");
};
