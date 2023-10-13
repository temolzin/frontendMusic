import { api } from "boot/axios";

  export const newQuotations = async ({ commit, dispatch }, payload) => {
    await api.post("/api/quotations", payload).then((response) => {
      return response.data;
    });

  };
