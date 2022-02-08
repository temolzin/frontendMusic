import can from "../helpers/can";
import { Store } from "../store/index.js";

export default function checkPermissions({ next, to, from, Router }) {
  const requiredPermissions = to.meta.permissions;
  if (!from.name) {
    Store.dispatch("auth/getMeUser").then(() => {
      const canEnter = can(requiredPermissions);
      console.log(canEnter);
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
