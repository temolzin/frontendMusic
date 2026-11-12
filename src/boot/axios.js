import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create({ baseURL: "https://sgmback.rootheim.com/" });

const AUTH_ENDPOINTS = [
  "/api/login",
  "/api/refresh",
  "/api/register",
  "/api/password/",
  "/api/authorize/",
];

let refreshTimer = null;
let refreshPromise = null;

function isAuthEndpoint(url = "") {
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function clearSession() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  localStorage.removeItem("token");
  if (window.location.pathname !== "/login" && window.location.pathname !== "/session-expired") {
    window.location.href = "/session-expired";
  }
}

function getStoredToken() {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function storeToken(token) {
  localStorage.setItem("token", JSON.stringify(token));
}

function getTokenExpiryMs(accessToken) {
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = api
      .get("/api/refresh")
      .then(({ data }) => {
        storeToken(data);
        scheduleRefresh(data.expires_in);
        return data.access_token;
      })
      .catch((error) => {
        clearSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function scheduleRefresh(expiresInSeconds) {
  if (refreshTimer) clearTimeout(refreshTimer);
  if (expiresInSeconds === null || expiresInSeconds === undefined) return;

  const refreshIn = Math.max(1, Number(expiresInSeconds) - 30) * 1000;
  refreshTimer = setTimeout(async () => {
    if (!getStoredToken()) return;
    try {
      await refreshAccessToken();
    } catch {
    }
  }, refreshIn);
}

api.interceptors.request.use(
  function (config) {
    const token = getStoredToken();
    if (token && token.access_token) {
      config.headers.common["Authorization"] = `Bearer ${token.access_token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (isAuthEndpoint(response.config?.url)) {
      const expiresIn = response.data?.expires_in;
      if (expiresIn) scheduleRefresh(expiresIn);
    }
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const config = error.config || {};

    if (status !== 401 || isAuthEndpoint(url)) {
      return Promise.reject(error);
    }

    if (config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      const newToken = await refreshAccessToken();
      config.headers = config.headers || {};
      if (config.headers.common) {
        config.headers.common["Authorization"] = `Bearer ${newToken}`;
      } else {
        config.headers["Authorization"] = `Bearer ${newToken}`;
      }
      return api(config);
    } catch (refreshError) {
      return Promise.reject(error);
    }
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  const token = getStoredToken();
  if (!token) return;

  if (!token.access_token) {
    clearSession();
    return;
  }

  const expiresAt = getTokenExpiryMs(token.access_token);
  const remainingSeconds = expiresAt
    ? Math.floor((expiresAt - Date.now()) / 1000)
    : token.expires_in;

  scheduleRefresh(remainingSeconds);
});

export { api };
