import { api } from "boot/axios";

export const fetchBookings = async ({ commit, rootState }) => {
  commit("SET_LOADING", true);
  commit("SET_ERROR", null);
  try {
    const response = await api.get(`/api/artist/my-bookings`);
    const bookings = response.data.data || [];
    
    commit("SET_BOOKINGS", bookings);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Error al cargar las contrataciones";
    commit("SET_ERROR", errorMessage);
    console.error("Error fetching bookings:", error);
  } finally {
    commit("SET_LOADING", false);
  }
};

export const selectDate = ({ commit }, date) => {
  commit("SET_SELECTED_DATE", date);
};

export const selectBooking = ({ commit }, booking) => {
  commit("SET_SELECTED_BOOKING", booking);
};

export const addBooking = ({ commit }, booking) => {
  commit("ADD_BOOKING", booking);
};

export const removeBooking = ({ commit }, bookingId) => {
  commit("REMOVE_BOOKING", bookingId);
};

export const updateBooking = ({ commit }, booking) => {
  commit("UPDATE_BOOKING", booking);
};

export const updateBookingStatus = async ({ commit }, { bookingId, status }) => {
  commit("SET_LOADING", true);
  commit("SET_ERROR", null);
  try {
    const response = await api.put(`/api/bookings/${bookingId}/status`, { status });
    
    if (response.data.data) {
      commit("UPDATE_BOOKING", response.data.data);
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Error al actualizar el estado";
    commit("SET_ERROR", errorMessage);
    console.error("Error updating booking status:", error);
    throw error;
  } finally {
    commit("SET_LOADING", false);
  }
};

export const getBookingsByStatus = async ({ commit, rootState }, status) => {
  commit("SET_LOADING", true);
  commit("SET_ERROR", null);
  try {
    const response = await api.get(`/api/artist/my-bookings`);
    const bookings = (response.data.data || []).filter(b => 
      b.status?.toLowerCase() === status.toLowerCase()
    );
    
    return bookings;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Error al obtener las contrataciones";
    commit("SET_ERROR", errorMessage);
    console.error("Error fetching bookings by status:", error);
    throw error;
  } finally {
    commit("SET_LOADING", false);
  }
};
