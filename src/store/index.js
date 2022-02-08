import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import auth from "./auth";
import product from "./product";

const Store = createStore({
  modules: {
    auth,
    product,
  },
  strict: process.env.DEBUGGING,
});

export default store(function (/* { ssrContext } */) {
  return Store;
});
export { Store };
