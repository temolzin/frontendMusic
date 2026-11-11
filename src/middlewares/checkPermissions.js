import can from "../helpers/can";
import { Store } from "../store/index.js";

export default async function checkPermissions({ next, to }) {
  const requiredPermissions = to.meta.permissions;
  const allowedRolesForArtistDetail = ["cliente"];

  if (localStorage.getItem("token")) {
    try {
      await Store.dispatch("auth/getMeUser");
    } catch (err) {
      if (err?.response?.status === 401) {
        window.localStorage.removeItem("token");
        return next({ path: "/session-expired" });
      }

      // Un error distinto de 401 (red, 500, etc.) no invalida la sesión.
      if (!Store.getters["auth/getMe"]?.id) {
        return next();
      }
    }
  }

  if (!localStorage.getItem("token")) {
    const redirect = to.fullPath !== '/' ? to.fullPath : undefined;
    return redirect
      ? next({ name: "LoginIn", query: { to: redirect } })
      : next({ name: "LoginIn" });
  }

  const userRole = Store.getters["auth/getMe"]?.role?.[0]
    ? String(Store.getters["auth/getMe"].role[0]).trim().toLowerCase()
    : "";

  if (to.name === "client.view-group-by-gender-slug" && allowedRolesForArtistDetail.includes(userRole)) {
    return next();
  }

  const canEnter = can(requiredPermissions);

  if (canEnter) {
    return next();
  }

  return next({ path: "/forbidden" });
}
