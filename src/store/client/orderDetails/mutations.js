export const setListShopingCard = (state, listShopingCardDetails) => {
  state.listShopingCard = listShopingCardDetails;
};

export const setChatMessages = (state, messages) => {
  state.chatMessages = messages;
};

export const addChatMessage = (state, message) => {
  state.chatMessages.push(message);
};
