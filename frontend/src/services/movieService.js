import api from './api';

export const movieService = {
  async getAllMovies(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/movies${query ? `?${query}` : ''}`;
    const res = await api.get(endpoint);
    return res.data;
  },

  async getMovieById(id) {
    const res = await api.get(`/movies/${id}`);
    return res.data?.movie;
  },

  async getMoviesByLanguage(language) {
    const res = await api.get(`/movies/language/${encodeURIComponent(language)}`);
    return res.data?.movies;
  },

  async searchMovies(query) {
    const res = await api.get(`/movies/search?q=${encodeURIComponent(query)}`);
    return res.data?.movies;
  },

  async getNowShowing() {
    const res = await api.get('/movies/now-showing');
    return res.data?.movies;
  },

  async getUpcoming() {
    const res = await api.get('/movies/upcoming');
    return res.data?.movies;
  },
};

export default movieService;
