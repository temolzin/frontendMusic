export const getBookings = (state) => state.bookings;

export const getSelectedDate = (state) => state.selectedDate;

export const getLoading = (state) => state.loading;

export const getError = (state) => state.error;

export const getSelectedBooking = (state) => state.selectedBooking;

export const getBookingsByDate = (state) => (date) => {
  if (!date) return [];
  const bookings = state.bookings.filter(booking => {
    const bookingDate = new Date(booking.date).toDateString();
    const selectedDate = new Date(date).toDateString();
    return bookingDate === selectedDate;
  });
  return bookings.length > 0 ? [bookings[0]] : [];
};

export const getOccupiedDates = (state) => {
  const uniqueDates = new Set();
  state.bookings.forEach(booking => {
    uniqueDates.add(booking.date);
  });
  return Array.from(uniqueDates);
};
