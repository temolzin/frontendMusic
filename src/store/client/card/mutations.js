export const setCards = (state, cards) => {
    state.cards = cards;
  };
  
  export const setCard = (state, card) => {
    state.card = card;
  };
  
  export const setUserCards = (state, cards) => {
    console.log(cards);
    state.cards = cards;
  };