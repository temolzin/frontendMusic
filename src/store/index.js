import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import auth from "./auth";
import product from "./product";

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      auth,
      product
    },
    strict: process.env.DEBUGGING,
  });

  return Store;
});
