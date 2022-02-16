import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import auth from "./auth";
import product from "./product";
import users from "./admin/users";
import roles from "./admin/roles";

const Store = createStore({
  modules: {
    auth,
    product,
    users,
    roles,
  },
  strict: process.env.DEBUGGING,
});

export default store(function (/* { ssrContext } */) {
  return Store;
});
export { Store };
