import { api } from "boot/axios";

export const getGalleryArtist = async ({ commit }) => {
  await api.get("/api/artist-new/gallery").then((response) => {
    commit("setGalleryArtist", response.data.artistGallery);
  });
};

export const createGalleryArtist = async ({ dispatch }, payload) => {
  await api.post("/api/artist-new/gallery-artist", payload,
  {headers : {'content-type': 'multipart/form-data'}}).then((response) => {
    dispatch("getGalleryArtist");
  });
};

export const upDateGalleryArtist = async ({ dispatch }, payload) => {
  await api.post("/api/artist-new/gallery-artist-update", payload,
  {headers : {'content-type': 'multipart/form-data'}}).then((response) => {
    dispatch("getGalleryArtist");
  });
};

export const deleteGalleryArtist= async ( payload) => {
  await api.delete('/api/artist-new/gallery-artist-delete',payload).then((response) => {
   
  });
};