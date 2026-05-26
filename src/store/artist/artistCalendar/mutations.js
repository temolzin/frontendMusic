export const SET_BOOKINGS = (state, bookings) => {
  state.bookings = bookings;
};

export const SET_SELECTED_DATE = (state, date) => {
  state.selectedDate = date;
};

export const SET_LOADING = (state, loading) => {
  state.loading = loading;
};

export const SET_ERROR = (state, error) => {
  state.error = error;
};

export const SET_SELECTED_BOOKING = (state, booking) => {
  state.selectedBooking = booking;
};

export const ADD_BOOKING = (state, booking) => {
  state.bookings.push(booking);
};

export const REMOVE_BOOKING = (state, bookingId) => {
  state.bookings = state.bookings.filter(b => b.id !== bookingId);
};

export const UPDATE_BOOKING = (state, updatedBooking) => {
  const index = state.bookings.findIndex(b => b.id === updatedBooking.id);
  if (index !== -1) {
    state.bookings.splice(index, 1, updatedBooking);
  }
};
