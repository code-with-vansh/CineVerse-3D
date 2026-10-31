import api from './api';

export const seatService = {
  async getShowSeats(showId) {
    const res = await api.get(`/shows/${showId}/seats`);
    return res.data;
  },
};

export default seatService;
