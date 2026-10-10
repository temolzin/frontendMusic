import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/" });

let refreshTimer = null;

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
      localStorage.removeItem("token");
      window.location.href = "/session-expired";
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

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
