import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import auth from "./auth";
import product from "./product";
import users from "./admin/users";
import roles from "./admin/roles";
import card from "./client/card";
import artist from "./artist/information";
import artistSales from "./artist/artistSales";
import artistList from "./artistList";
import quotations from "./quotations"
import userSanctions from "./admin/userSanctions";
import musicalGenders from "./admin/musicalGenders";
import galleryArtist from "./artist/galleryArtist";
import clientMusicalGenders from "./client/clientMusicalGenders";
import lastArtist from "./general/lastArtist";
import shoppingCard from "./client/shoppingCard";
import orderDetails from "./client/orderDetails";
import favouriteArtists from "./client/favouriteArtists";
import UsersSuscribe from "./general/UsersSuscribe";
import videoArtist from "./artist/videoArtist";
import offers from "./artist/offers";
import payoutMethod from './artist/payoutMethod'
import supportTickets from "./supportTickets";
import payouts from "./admin/payouts";
import approvals from './artist/approvals';
import artistApprovals from './admin/artistApprovals';

const Store = createStore({
  modules: {
    auth,
    product,
    users,
    roles,
    card,
    artist,
    artistList,
    quotations,
    userSanctions,
    musicalGenders,
    galleryArtist,
    clientMusicalGenders,
    lastArtist,
    shoppingCard,
    orderDetails,
    favouriteArtists,
    UsersSuscribe,
    artistSales,
    videoArtist,
    offers,
    payoutMethod,
    supportTickets,
    payouts,
    approvals,
    artistApprovals,
  },
  strict: process.env.DEBUGGING,
});

export default store(function (/* { ssrContext } */) {
  return Store;
});
export { Store };
