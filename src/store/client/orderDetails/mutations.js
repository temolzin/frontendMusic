export const setListShopingCard = (state, listShopingCardDetails) => {
  state.listShopingCard = listShopingCardDetails;
};

export const setChatMessages = (state, messages) => {
  state.chatMessages = messages;
};

export const addChatMessage = (state, message) => {
  state.chatMessages.push(message);
};

export const setChatActive = (state, value) => { 
  state.isChatActive = value;
};

export const setArtistRating = (state, payload) => {
  state.artistRatings = {
    ...state.artistRatings,
    [payload.purchaseId]: payload.rating
  };
};
