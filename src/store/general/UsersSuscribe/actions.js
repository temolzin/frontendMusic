import { api } from "boot/axios";

export const sendEmail = async ({ dispatch }, payload) => {
  await api.post("/api/users-subscribe/send", payload).then((response) => {
  });
};

export const setEmail = async ({ dispatch }, payload) => {
  await api.post("/api/users-subscribe/new", payload).then((response) => {
  });
};
