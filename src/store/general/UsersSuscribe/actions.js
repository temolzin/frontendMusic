import { api } from "boot/axios";

export const sendEmail = async ({ dispatch }, payload) => {
  await api.post("/api/users_subscribe/send", payload).then((response) => {
    // dispatch("getEmails");
  });
};

export const setEmail = async ({ dispatch }, payload) => {
  await api.post("/api/users_subscribe/new", payload).then((response) => {
    // dispatch("getEmails");
  });
};
