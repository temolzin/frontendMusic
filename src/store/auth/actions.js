import { api } from "boot/axios";

export const doLogin = async ({ commit, dispatch }, payload) => {
  await api.post("/api/login", payload).then((response) => {
    const token = response.data;
    commit("setToken", token);
  
  });
};

export const registerUser = async ({ commit, dispatch }, payload) => {
  await api.post("/api/register", payload).then((response) => {
    return response.data;
  });
};

export const signOut = async ({ commit }) => {
  await api.get("/api/logout").then((response) => {
    commit("removeToken");
    commit("setMe", "");
  });
};

export const getMeUser = async ({ commit }) => {
  await api.get("/api/me").then((response) => {
    commit("setMe", response.data.user);
  });
};

export const init = async ({ commit, dispatch }) => {
  const token = localStorage.getItem("token");
  if (token) {
    await commit("setToken", JSON.parse(token));
    api.defaults.headers.common.Authorization = "Bearer " + JSON.parse(token).access_token;
    dispatch("getMeUser", JSON.parse(token));
  } else {
    commit("removeToken");
  }
};

export const doLoginGmail = async () => {
  await api.get("/api/authorize/google/redirect").then((response) => {
    if(response.data.url){
      window.location.href = response.data.url
    }
  });
};

export const doLoginGmailCallback = async ({ commit, dispatch }, payload) => {
  await api.get("/api/authorize/google/callback" , { params: payload }).then((response) => {
    const token = response.data;
    dispatch("getMeUser", token);
    commit("setToken", token);
  });
};


export const updateDetails = async ({ dispatch }, payload) => {
  await api.put("/api/user/change-details", payload).then((response) => {
   dispatch("getMeUser");
  });
};

export const updatePassword = async ({ dispatch }, payload) => {
  await api.put("/api/user/change-password", payload).then((response) => {
   dispatch("getMeUser");
  });
};