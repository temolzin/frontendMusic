import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import auth from "./auth";
import product from "./product";
import users from "./admin/users";
import roles from "./admin/roles";
import card from "./client/card";
import artist from "./artist/information";
import musicalGenders from "./admin/musicalGenders";
import galleryArtist from "./artist/galleryArtist";

const Store = createStore({
  modules: {
    auth,
    product,
    users,
    roles,
    card,
    artist,
    musicalGenders,
    galleryArtist,
  },
  strict: process.env.DEBUGGING,
});

export default store(function (/* { ssrContext } */) {
  return Store;
});
export { Store };
