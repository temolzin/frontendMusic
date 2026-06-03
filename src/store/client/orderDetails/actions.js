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

export const fetchChatMessages = async ({ commit }, artistSaleId) => {
  try {
    const response = await api.get(`/api/chat/messages/${artistSaleId}`);
    const messages = Array.isArray(response.data?.messages) ? response.data.messages : [];
    commit("setChatMessages", messages);
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    commit("setChatMessages", []);
    return [];
  }
};

export const sendChatMessage = async ({ commit }, payload) => {
  try {
    const response = await api.post('/api/chat/messages', payload);
    const message = response.data?.message || null;
    if (message) {
      commit("addChatMessage", message);
    }
    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};
