import { api } from "boot/axios";

export const getCards = async ({ commit }) => {
  await api.get("/api/client-card").then((response) => {
    const cards = Array.isArray(response.data.client) ? response.data.client : (response.data.client ? [response.data.client] : []);
    commit("setCards", cards);
  });
};

export const createCard = async ({ dispatch }, payload) => {
  await api.post("/api/client-card", payload).then((response) => {
    dispatch("getCards");
  });
};

export const deleteCard = async ({ dispatch }, id) => {
  await api.delete(`/api/client-card/${id}`).then((response) => {
    dispatch("getCards");
  });
};

export const updateCard = async ({ dispatch }, form) => {
  await api.put(`/api/client-card/${form.id}`, form).then((response) => {
    dispatch("getCards");
  });
};

export const showCards = async ({ commit }) => {
  await api.get("/api/client-card").then((response) => {
    const cards = Array.isArray(response.data.client) ? response.data.client : (response.data.client ? [response.data.client] : []);
    commit("setCards", cards);
  });
};
