import can from "../helpers/can";
import { Store } from "../store/index.js";

export default function checkPermissions({ next, to, from, Router }) {
  const requiredPermissions = to.meta.permissions;

  if (localStorage.getItem("token")) {
    Store.dispatch("auth/getMeUser")
      .then(() => {})
      .catch((err) => {
        if (err) {
          if (Store.state.auth.me.name == null) {
            console.log("entro");
            window.localStorage.removeItem("token");
          }
        }
      });
  }

  if (!localStorage.getItem("token")) {
    return Router.push({ name: "LoginIn" });
  } else {
    if (!from.name) {
      Store.dispatch("auth/getMeUser").then(() => {
        const canEnter = can(requiredPermissions);
        // console.log(canEnter);
        if (canEnter) {
          return next();
        }
        return Router.push({ name: "Home" });
      });
    } else {
      const canEnter = can(requiredPermissions);
      if (canEnter) {
        return next();
      }
      return Router.push({ name: "Home" });
    }
  }
}
