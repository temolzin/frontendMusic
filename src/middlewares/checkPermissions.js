import can from "../helpers/can";
import { Store } from "../store/index.js";

export default async function checkPermissions({ next, to }) {
  const requiredPermissions = to.meta.permissions;
  const allowedRolesForArtistDetail = ["cliente"];

  if (localStorage.getItem("token")) {
    try {
      await Store.dispatch("auth/getMeUser");
    } catch (err) {
      window.localStorage.removeItem("token");
      return next({ path: "/session-expired" });
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
