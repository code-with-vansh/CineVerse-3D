import api from './api';

export const authService = {
  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data?.token) {
      localStorage.setItem('cineverse_token', res.data.token);
      localStorage.setItem('cineverse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('cineverse_token', res.data.token);
      localStorage.setItem('cineverse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    if (res.data?.user) {
      localStorage.setItem('cineverse_user', JSON.stringify(res.data.user));
    }
    return res.data?.user;
  },

  logout() {
    localStorage.removeItem('cineverse_token');
    localStorage.removeItem('cineverse_user');
  },

  getCurrentUser() {
    const stored = localStorage.getItem('cineverse_user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('cineverse_token');
  },
};

export default authService;
