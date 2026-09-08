import { api } from "boot/axios";

export async function fetchComments({ commit }, filter = "") {
  commit("setLoading", true);
  try {
    const params = filter ? { filter } : {};
    const { data } = await api.get("/api/system-comments", { params });
    commit("setComments", data.data || []);
  } finally {
    commit("setLoading", false);
  }
}

export async function submitComment({ commit }, payload) {
  commit("setSubmitting", true);
  try {
    const { data } = await api.post("/api/system-comments", payload);
    commit("prependComment", data.data);
    return data.data;
  } finally {
    commit("setSubmitting", false);
  }
}

export async function checkCanComment({ commit }) {
  const { data } = await api.get("/api/system-comments/can-comment");
  commit("setCanComment", Boolean(data.can));
}
