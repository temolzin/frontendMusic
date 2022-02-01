import { api } from "boot/axios";

export const doLogin = async ({ commit, dispatch }, payload) => {
  await api.post("/api/login", payload).then((response) => {
    const token = response.data;
    commit("setToken", token);
    api.defaults.headers.common.Authorization = "Bearer " + token.access_token;
    dispatch("getMe", token);
  });
};

export const registerUser = async ({ commit, dispatch }, payload) => {
  await api.post("/api/register", payload).then((response) => {
    return response.data;
  });
};

export const signOut = async ({ commit }, token) => {
  token = localStorage.getItem("token");
  token = JSON.parse(token).access_token;
  await api.get("/api/logout", { headers: {"Authorization" : `Bearer ${token}`}}).then((response) => {
    api.defaults.headers.common.Authorization = "";
    commit("removeToken");
    commit("setMe", "");
  });
};

export const getMe = async ({ commit }, token) => {
  token = token.access_token;
  await api.get("/api/me", { headers: {"Authorization" : `Bearer ${token}`}}).then((response) => {
    //console.log(response.data.user)
    //commit("setMe", response.data);
    commit("setMe", response.data.user);
  });
};

export const init = async ({ commit, dispatch }) => {
  const token = localStorage.getItem("token");
  if (token) {
    await commit("setToken", JSON.parse(token));
    api.defaults.headers.common.Authorization = "Bearer " + JSON.parse(token).access_token;
    dispatch("getMe", JSON.parse(token));
  } else {
    commit("removeToken");
  }
};


export const doLoginGmail = async ({ commit, dispatch }) => {
  await api.get("/api/authorize/google/redirect").then((response) => {
    if(response.data.url){
      window.location.href = response.data.url
    }
  });
};

export const doLoginGmailCallback = async ({ commit, dispatch }, payload) => {
  await api.get("/api/authorize/google/callback" , { params: payload }).then((response) => {
    const token = response.data;
    dispatch("getMe", token);
    commit("setToken", token);
    api.defaults.headers.common.Authorization = "Bearer " + token.access_token;
  });
};