import { api } from "boot/axios";

export const getListShoppingCard = async ({ commit, dispatch }) => {
  await api.get("/api/cliente/shopping_card/listShopingCardDetails").then((response) => {
    //console.log(response);
    commit("setListShopingCard", response.data.list_shoping_card_details);
    dispatch("getCountListShoppingCard");
  });
};

export const getCountListShoppingCard = async ({ commit }) => {
  await api.get("/api/cliente/shopping_card/countListShopingCardDetails").then((response) => {
    commit("setCountListShopingCard", response.data.count_list_shoping_card_details);
  });
};

export const create_order = async ({ dispatch }, payload) => {
  await api.post("/api/cliente/shopping_card/create", payload).then((response) => {
      dispatch("getListShoppingCard");
    });
};

export const updateItemShoppingCart = async ({ dispatch }, payload) => {
  await api.post("/api/cliente/shopping_card/updateHourItemShoppingCart", payload).then((response) => {
      dispatch("getListShoppingCard");
    });
};

export const deleteItembyId= async ({ dispatch }, artist_id) => {
  await api.delete(`/api/cliente/shopping_card/deleteItemShoppingCardDetails/${artist_id}`).then((response) => {
    dispatch("getListShoppingCard");
  });
};

export const createPayment = async ({ dispatch }, payload) => {
  try {
    const response = await api.post("/api/process-payment", payload);
    return response.data;
  } catch (error) {
    console.error("Error en createPayment:", error);
    throw error;
  }
};

export const clearCart = async ({ state, dispatch }) => {
  try {
    const shoppingCardDetail = state.listShopingCard?.[0]?.shopping_card_detail || [];
    
    for (const item of shoppingCardDetail) {
      if (item.artist_id) {
        await api.delete(`/api/cliente/shopping_card/deleteItemShoppingCardDetails/${item.artist_id}`);
      }
    }
    
    await dispatch("getListShoppingCard");
  } catch (error) {
    console.error("Error al limpiar el carrito:", error);
    throw error;
  }
};

