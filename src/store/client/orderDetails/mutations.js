export const setListShopingCard = (state, listShopingCardDetails) => {
  console.log(listShopingCardDetails); // Verifica los datos antes de actualizar el estado
  state.listShopingCard = listShopingCardDetails;
};
