import api from './api';

export const showService = {
  async getShows(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/shows${query ? `?${query}` : ''}`;
    const res = await api.get(endpoint);
    return res.data?.shows;
  },

  async getShowById(id) {
    const res = await api.get(`/shows/${id}`);
    return res.data?.show;
  },

  async getShowsByMovie(movieId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/shows/movie/${movieId}${query ? `?${query}` : ''}`;
    const res = await api.get(endpoint);
    return res.data?.shows;
  },

  async getShowsByTheatre(theatreId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/shows/theatre/${theatreId}${query ? `?${query}` : ''}`;
    const res = await api.get(endpoint);
    return res.data?.shows;
  },
};

export default showService;
