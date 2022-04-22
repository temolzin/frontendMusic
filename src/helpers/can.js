import { Store } from "../store/index.js";

//console.log(Store.getters["auth/getMe"].role);

export default (permissions) => {
  const userPermissions = Store.getters["auth/getMe"].permissions;
  let canEnter = false;
  // console.log({ userPermissions });
  if (!userPermissions || !permissions) {
    return canEnter;
  }
  if (!Array.isArray(permissions)) {
    canEnter = userPermissions.includes(permissions);
  } else {
    permissions.forEach((permission) => {
      if (userPermissions.includes(permission)) {
        canEnter = true;
      }
    });
  }
  return canEnter;
};
