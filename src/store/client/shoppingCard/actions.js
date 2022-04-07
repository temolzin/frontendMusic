import { api } from "boot/axios";

export const getListShoppingCard = async ({ commit }) => {
  await api.get("/api/cliente/shopping_card/listShopingCardDetails").then((response) => {
    //console.log(response);
    commit("setListShopingCard", response.data.list_shoping_card_details);
  });
};

export const create_order = async ({ dispatch }, payload) => {
  await api.post("/api/cliente/shopping_card/create", payload).then((response) => {
      dispatch("getListShoppingCard");
    });
};
