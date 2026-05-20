import { api } from "boot/axios";

export const viewShoppingCardDetails = async ({ commit }) => {
  await api.get("/api/cliente/shopping_card/listShopingCardDetails").then((response) => {
    commit("setListShopingCard", response.data.list_shoping_card_details);
  });
};

export const viewPurchaseHistory = async ({ commit }) => {
  try {
    const response = await api.get("/api/cliente/shopping_card/purchaseHistory");
    console.log("Purchase History Response:", response.data);
    commit("setListShopingCard", response.data.purchases);
  } catch (error) {
    console.error("Error fetching purchase history:", error);
  }
};
