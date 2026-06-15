import { api } from "boot/axios";

export const getOffers = async ({ commit }) => {
    const response = await api.get("/api/artist/offers");
    commit("setOffers", response.data.offers);
};

export const createOffer = async ({ dispatch }, payload) => {
    await api.post("/api/artist/offers", payload);
    dispatch("getOffers");
};

export const updateOffer = async ({ dispatch }, { id, data }) => {
    await api.put(`/api/artist/offers/${id}`, data);
    dispatch("getOffers");
};

export const deleteOffer = async ({ dispatch }, id) => {
    await api.delete(`/api/artist/offers/${id}`);
    dispatch("getOffers");
};
