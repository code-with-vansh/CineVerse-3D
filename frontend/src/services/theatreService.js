import api from './api';

export const theatreService = {
  async getAllTheatres(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/theatres${query ? `?${query}` : ''}`;
    const res = await api.get(endpoint);
    return res.data?.theatres;
  },

  async getTheatreById(id) {
    const res = await api.get(`/theatres/${id}`);
    return res.data?.theatre;
  },

  async getTheatresByCity(city) {
    const res = await api.get(`/theatres/city/${encodeURIComponent(city)}`);
    return res.data?.theatres;
  },

  async getTheatresByMovie(movieId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/movies/${movieId}/theatres${query ? `?${query}` : ''}`;
    const res = await api.get(endpoint);
    return res.data?.theatres;
  },
};

export default theatreService;
