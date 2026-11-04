import { api } from "boot/axios";

export const getArtistVideos = async ({ commit }) => {
    await api.get("/api/artist-new/videos").then((response) => {
        commit("setArtistVideos", response.data.artistVideos);
    });
};

export const createArtistVideo = async ({ dispatch }, payload) => {
    await api.post("/api/artist-new/videos", payload).then(() => {
        dispatch("getArtistVideos");
    });
};

export const deleteArtistVideo = async ({ dispatch }, id) => {
    await api.delete(`/api/artist-new/videos/${id}`).then(() => {
        dispatch("getArtistVideos");
    });
};
