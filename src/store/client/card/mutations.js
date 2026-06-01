export const setCards = (state, cards) => {
  state.cards = Array.isArray(cards) ? cards : [];
};

export const setCard = (state, card) => {
  state.card = card;
};
