import api from './api';

export const bookingService = {
  async holdSeats({ showId, seatIds, guestEmail, guestName }) {
    const res = await api.post('/bookings/hold', {
      showId,
      seatIds,
      guestEmail,
      guestName,
    });
    return res.data;
  },

  async releaseHold(bookingReference) {
    const res = await api.post('/bookings/release', { bookingReference });
    return res;
  },

  async getBooking(referenceOrId) {
    const res = await api.get(`/bookings/${referenceOrId}`);
    return res.data?.booking;
  },

  async updateBookingSnacks(bookingIdentifier, items) {
    const res = await api.post(`/bookings/${bookingIdentifier}/snacks`, { items });
    return res.data?.booking;
  },

  async getBookingSummary(bookingIdentifier) {
    const res = await api.get(`/bookings/${bookingIdentifier}/summary`);
    return res.data;
  },

  async getMyBookings() {
    const res = await api.get('/bookings/user/me');
    return res.data?.bookings;
  },
};

export default bookingService;
