import { api } from "boot/axios";

export const fetchArtistsList = async ({ commit }) => {
    await api.get("/api/admin/artists/list").then((response) => {
        commit("setArtistsList", response.data.data || response.data);
    });
};

export const fetchArtistAnalytics = async ({ commit }, { artistId, filter }) => {
    await api.get(`/api/admin/artist-analytics/${artistId}`, {
        params: { filter },
    }).then((response) => {
        commit("setArtistData", response.data.data);
    });
};

export const fetchMyArtistAnalytics = async ({ commit }, { filter } = {}) => {
    await api.get("/api/artist/my-analytics", {
        params: { filter },
    }).then((response) => {
        commit("setArtistData", response.data.data);
    });
};
