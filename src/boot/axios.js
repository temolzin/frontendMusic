import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create({ baseURL: "https://sgmback.rootheim.com/" });

let refreshTimer = null;

function clearSession() {
  localStorage.removeItem("token");
  if (window.location.pathname !== "/login" && window.location.pathname !== "/session-expired") {
    window.location.href = "/session-expired";
  }
}

function scheduleRefresh(expiresInSeconds) {
  if (refreshTimer) clearTimeout(refreshTimer);
  const refreshIn = (expiresInSeconds - 10) * 1000;
  refreshTimer = setTimeout(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await api.get("/api/refresh");
      localStorage.setItem("token", JSON.stringify(data));
      scheduleRefresh(data.expires_in);
    } catch {
      clearSession();
    }
  }, refreshIn);
}

api.interceptors.request.use(
  function (config) {
    let token = localStorage.getItem("token");
    if (token) {
      config.headers.common["Authorization"] = `Bearer ${JSON.parse(token).access_token}`;
    }
    return config;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/session-expired";
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.config.url?.endsWith("/api/login") || response.config.url?.endsWith("/api/refresh")) {
      const expiresIn = response.data?.expires_in;
      if (expiresIn) scheduleRefresh(expiresIn);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    if (status === 401 && !url.endsWith("/api/login") && !url.endsWith("/api/refresh")) {
      clearSession();
    }
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const expiresIn = JSON.parse(token).expires_in;
      if (expiresIn) scheduleRefresh(expiresIn);
    } catch {
      clearSession();
    }
  }
});

export { api };
