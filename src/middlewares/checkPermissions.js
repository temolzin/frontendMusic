import can from "../helpers/can";
import { Store } from "../store/index.js";

export default async function checkPermissions({ next, to, from, Router }) {
  const requiredPermissions = to.meta.permissions;
  const allowedRolesForArtistDetail = ["cliente", "artista", "administrador"];

  if (localStorage.getItem("token")) {
    try {
      await Store.dispatch("auth/getMeUser");
    } catch (err) {
      if (Store.state.auth.me.name == null) {
        window.localStorage.removeItem("token");
      }
    }
  }

  if (!localStorage.getItem("token")) {
    return Router.push({ name: "LoginIn" });
  }

  const userRole = Store.getters["auth/getMe"]?.role?.[0]
    ? String(Store.getters["auth/getMe"].role[0]).trim().toLowerCase()
    : "";

  if (to.name === "client.view-group-by-gender-slug" && allowedRolesForArtistDetail.includes(userRole)) {
    return next();
  }

  if (!from.name) {
    const canEnter = can(requiredPermissions);
    if (canEnter) {
      return next();
    }
    return Router.push({ name: from.name, params: from.params });
  }

  const canEnter = can(requiredPermissions);
  if (canEnter) {
    return next();
  }
  return Router.push({ name: from.name, params: from.params });
}
