import { api } from "boot/axios";

export const doLogin = async ({ commit, dispatch }, payload) => {
  await api.post("/api/login", payload).then((response) => {
    const token = response.data;
    commit("setToken", token);
    api.defaults.headers.common.Authorization = "JWT " + token.access_token;
    dispatch("getMe", token);
  });
};

export const signOut = async ({ commit }, token) => {
  token = localStorage.getItem("token");
  token = JSON.parse(token).access_token;
  await api.get("/api/logout", { params: { token } }).then((response) => {
    api.defaults.headers.common.Authorization = "";
    commit("removeToken");
    commit("setMe", '');
  });
};

export const getMe = async ({ commit }, token) => {
  token = token.access_token;
  await api.get("/api/me", { params: { token } }).then((response) => {
    commit("setMe", response.data);
  });
};

export const init = async ({ commit, dispatch }) => {
  const token = localStorage.getItem("token");
  if (token) {
    await commit("setToken", JSON.parse(token));
    api.defaults.headers.common.Authorization = "JWT " + JSON.parse(token).access_token;
    dispatch("getMe", JSON.parse(token));
  } else {
    commit("removeToken");
  }
};
