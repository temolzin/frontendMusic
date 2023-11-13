import { api } from "boot/axios";

export const viewShoppingCardDetails = async ({ commit }) => {
  await api.get("/api/cliente/shopping_card/listShopingCardDetails").then((response) => {
    commit("setListShopingCard", response.data.list_shoping_card_details);
  });
};
