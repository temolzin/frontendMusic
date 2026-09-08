import { api } from "boot/axios";

export const getCards = async ({ commit }) => {
  await api.get("/api/cards").then((response) => {
    const cards = Array.isArray(response.data.cards) ? response.data.cards : (response.data.cards ? [response.data.cards] : []);
    commit("setCards", cards);
  });
};

export const createCard = async ({ dispatch }, payload) => {
  await api.post("/api/cards", payload).then((response) => {
    dispatch("getCards");
  });
};

export const deleteCard = async ({ dispatch }, id) => {
  await api.delete(`/api/cards/${id}`).then((response) => {
    dispatch("getCards");
  });
};

export const updateCard = async ({ dispatch }, form) => {
  await api.put(`/api/cards/${form.id}`, form).then((response) => {
    dispatch("getCards");
  });
};

export const showCards = async ({ commit }) => {
  await api.get("/api/cards").then((response) => {
    const cards = Array.isArray(response.data.cards) ? response.data.cards : (response.data.cards ? [response.data.cards] : []);
    commit("setCards", cards);
  });
};
